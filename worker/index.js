// Cloudflare Worker API 服务 - 使用 D1 数据库
const ADMIN_SECRET = "nav-admin-secret-key"; // 固定密钥

export default {
  async fetch(request, env) {
    const DB = env.DB;
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    // CORS 处理
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-secret',
        },
      });
    }

    // 公开接口（首页数据）- 不需要认证
    if (method === 'GET' && (
      path.startsWith('/api/menus') ||
      path.startsWith('/api/cards') ||
      path.startsWith('/api/ads') ||
      path.startsWith('/api/friends')
    )) {
      if (path.startsWith('/api/menus')) return handleGetMenus(DB);
      if (path.startsWith('/api/cards')) return handleGetCards(url, DB);
      if (path.startsWith('/api/ads')) return handleGetAds(DB);
      if (path.startsWith('/api/friends')) return handleGetFriends(DB);
    }

    // 登录接口（公开）
    if (path === '/api/auth/login' && method === 'POST') {
      return handleLogin(request, DB, env);
    }
    
    // 数据初始化接口（公开）
    if (path === '/api/init' && method === 'POST') {
      return handleInitData(request, DB);
    }

    // 检查固定密钥（作为备用认证方式）
    const secretKey = request.headers.get('x-admin-secret');
    if (secretKey === ADMIN_SECRET) {
      // 使用固定密钥认证，跳过 Token 验证
      return handleAuthenticatedRequest(request, env, path, method, url, DB);
    }

    // Token 认证
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return corsResponse({ error: 'Unauthorized: 需要 x-admin-secret 或 Bearer token' }, { status: 401 });
    }

    // 验证 Token
    const tokenResult = await validateToken(token, DB);
    if (!tokenResult.valid) {
      return corsResponse({ error: tokenResult.reason }, { status: 401 });
    }
    const userId = tokenResult.userId;

    // 管理员接口（Token 认证）
    return handleAuthenticatedRequest(request, env, path, method, url, DB, userId);
  }
};

// 使用固定密钥或Token认证的处理函数
async function handleAuthenticatedRequest(request, env, path, method, url, DB, userId = 1) {
  // 管理员接口
  if (path === '/api/auth/logout' && method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    return handleLogout(token, DB);
  }

  // 菜单管理
  if (path === '/api/menus') {
    if (method === 'GET') return handleGetMenus(DB);
    if (method === 'POST') return handleAddMenu(request, DB);
  }
  if (path.match(/^\/api\/menus\/\d+$/) && method === 'PUT') {
    const id = path.split('/')[3];
    return handleUpdateMenu(id, request, DB);
  }
  if (path.match(/^\/api\/menus\/\d+$/) && method === 'DELETE') {
    const id = path.split('/')[3];
    return handleDeleteMenu(id, DB);
  }

  // 子菜单管理（兼容原有API路径）
  if (path.match(/^\/api\/menus\/\d+\/submenus$/) && method === 'POST') {
    const parentId = path.split('/')[3];
    return handleAddSubMenu(request, parentId, DB);
  }
  if (path === '/api/submenus' && method === 'GET') {
    return handleGetSubMenus(url.searchParams.get('menuId'), DB);
  }
  if (path.match(/^\/api\/menus\/submenus\/\d+$/) && method === 'PUT') {
    const id = path.split('/')[4];
    return handleUpdateSubMenu(id, request, DB);
  }
  if (path.match(/^\/api\/menus\/submenus\/\d+$/) && method === 'DELETE') {
    const id = path.split('/')[4];
    return handleDeleteSubMenu(id, DB);
  }

  // 卡片管理
  if (path.startsWith('/api/cards') && method === 'POST') {
    return handleAddCard(request, DB);
  }
  if (path.match(/^\/api\/cards\/\d+$/) && method === 'PUT') {
    const id = path.split('/')[3];
    return handleUpdateCard(id, request, DB);
  }
  if (path.match(/^\/api\/cards\/\d+$/) && method === 'DELETE') {
    const id = path.split('/')[3];
    return handleDeleteCard(id, DB);
  }

  // 广告管理
  if (path === '/api/ads') {
    if (method === 'GET') return handleGetAds(DB);
    if (method === 'POST') return handleAddAd(request, DB);
  }
  if (path.match(/^\/api\/ads\/\d+$/) && method === 'PUT') {
    const id = path.split('/')[3];
    return handleUpdateAd(id, request, DB);
  }
  if (path.match(/^\/api\/ads\/\d+$/) && method === 'DELETE') {
    const id = path.split('/')[3];
    return handleDeleteAd(id, DB);
  }

  // 友情链接管理
  if (path === '/api/friends') {
    if (method === 'GET') return handleGetFriends(DB);
    if (method === 'POST') return handleAddFriend(request, DB);
  }
  if (path.match(/^\/api\/friends\/\d+$/) && method === 'PUT') {
    const id = path.split('/')[3];
    return handleUpdateFriend(id, request, DB);
  }
  if (path.match(/^\/api\/friends\/\d+$/) && method === 'DELETE') {
    const id = path.split('/')[3];
    return handleDeleteFriend(id, DB);
  }

  // 用户管理
  if (path === '/api/users' && method === 'GET') {
    return handleGetUsers(DB);
  }
  if (path === '/api/users' && method === 'POST') {
    return handleAddUser(request, DB);
  }
  if (path.match(/^\/api\/users\/\d+$/) && method === 'PUT') {
    const id = path.split('/')[3];
    return handleUpdateUser(id, request, DB);
  }
  if (path.match(/^\/api\/users\/\d+$/) && method === 'DELETE') {
    const id = path.split('/')[3];
    return handleDeleteUser(id, DB);
  }
  if (path === '/api/users/me' && method === 'GET') {
    return handleGetMe(userId, DB);
  }
  if (path === '/api/users/me/password' && method === 'PUT') {
    return handleUpdatePassword(userId, request, DB);
  }

  return corsResponse({ error: 'Not found' }, { status: 404 });
}

// 统一返回 CORS 响应
function corsResponse(body, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...(options.headers || {}),
  };
  return new Response(JSON.stringify(body), {
    status: options.status || 200,
    headers,
  });
}

// 登录处理
async function handleLogin(request, DB, env) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // 获取客户端IP
    const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
    const loginTime = new Date().toISOString();

    // 使用数据库验证
    const result = await DB.prepare(
      'SELECT id, username FROM users WHERE username = ? AND password = ?'
    ).bind(username, password).first();
    
    if (!result) {
      return corsResponse({ error: '用户名或密码错误' }, { status: 401 });
    }

    const token = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 604800000).toISOString(); // 7天
    
    await DB.prepare(
      'INSERT INTO tokens (token, user_id, expires_at) VALUES (?, ?, ?)'
    ).bind(token, result.id, expiresAt).run();
    
    // 更新用户登录记录
    await DB.prepare(
      'UPDATE users SET last_login_time = ?, last_login_ip = ? WHERE id = ?'
    ).bind(loginTime, clientIp, result.id).run();
    
    return corsResponse({ data: { token, username: result.username, id: result.id } });
  } catch (error) {
    console.error("登录错误:", error);
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

// 验证 Token
async function validateToken(token, DB) {
  try {
    const result = await DB.prepare(
      'SELECT user_id, expires_at FROM tokens WHERE token = ?'
    ).bind(token).first();
    
    if (!result) {
      return { valid: false, reason: 'Token 不存在' };
    }
    
    // 检查是否过期
    if (new Date(result.expires_at) < new Date()) {
      await DB.prepare('DELETE FROM tokens WHERE token = ?').bind(token).run();
      return { valid: false, reason: 'Token 已过期' };
    }
    
    return { valid: true, userId: result.user_id };
  } catch (error) {
    return { valid: false, reason: '数据库错误: ' + error.message };
  }
}

// 登出
async function handleLogout(token, DB) {
  await DB.prepare('DELETE FROM tokens WHERE token = ?').bind(token).run();
  return corsResponse({ data: {} });
}

// 获取当前用户信息
async function handleGetMe(userId, DB) {
  try {
    const result = await DB.prepare(
      'SELECT id, username, last_login_time, last_login_ip FROM users WHERE id = ?'
    ).bind(userId).first();
    
    if (!result) {
      return corsResponse({ error: '用户不存在' }, { status: 404 });
    }
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

// 修改密码
async function handleUpdatePassword(userId, request, DB) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    
    if (!currentPassword || !newPassword) {
      return corsResponse({ error: '请提供当前密码和新密码' }, { status: 400 });
    }
    
    if (newPassword.length < 6) {
      return corsResponse({ error: '新密码长度至少为6位' }, { status: 400 });
    }
    
    // 数据库密码验证模式
    const user = await DB.prepare(
      'SELECT password FROM users WHERE id = ?'
    ).bind(userId).first();
    
    if (!user || user.password !== currentPassword) {
      return corsResponse({ error: '当前密码错误' }, { status: 401 });
    }
    
    await DB.prepare(
      'UPDATE users SET password = ? WHERE id = ?'
    ).bind(newPassword, userId).run();
    
    // 清除所有旧token，强制重新登录
    await DB.prepare('DELETE FROM tokens WHERE user_id = ?').bind(userId).run();
    
    return corsResponse({ data: { message: '密码修改成功，请重新登录' } });
  } catch (error) {
    console.error("修改密码错误:", error);
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

// 菜单 CRUD
async function handleGetMenus(DB) {
  try {
    const menus = await DB.prepare('SELECT id, name, order_num as `order` FROM menus ORDER BY order_num ASC').all();
    const subMenus = await DB.prepare('SELECT id, parent_id, name, order_num as `order` FROM sub_menus ORDER BY order_num ASC').all();
    
    // 将子菜单添加到对应的父菜单
    const result = menus.results.map(menu => ({
      ...menu,
      subMenus: subMenus.results.filter(sm => sm.parent_id === menu.id)
    }));
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleAddMenu(request, DB) {
  try {
    const body = await request.json();
    const result = await DB.prepare(
      'INSERT INTO menus (name, order_num) VALUES (?, ?) RETURNING id, name, order_num as `order`'
    ).bind(body.name, body.order || 0).first();
    
    return corsResponse({ data: { ...result, subMenus: [] } });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleUpdateMenu(id, request, DB) {
  try {
    const body = await request.json();
    const result = await DB.prepare(
      'UPDATE menus SET name = ?, order_num = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, name, order_num as `order`'
    ).bind(body.name, body.order, id).first();
    
    if (!result) {
      return corsResponse({ error: '菜单不存在' }, { status: 404 });
    }
    
    const subMenus = await DB.prepare(
      'SELECT id, parent_id, name, order_num as `order` FROM sub_menus WHERE parent_id = ?'
    ).bind(id).all();
    
    return corsResponse({ data: { ...result, subMenus: subMenus.results } });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleDeleteMenu(id, DB) {
  try {
    const result = await DB.prepare('DELETE FROM menus WHERE id = ?').bind(id).run();
    
    if (result.changes === 0) {
      return corsResponse({ error: '菜单不存在' }, { status: 404 });
    }
    
    return corsResponse({ data: {} });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

// 子菜单 CRUD
async function handleGetSubMenus(menuId, DB) {
  try {
    const result = await DB.prepare(
      'SELECT id, parent_id, name, order_num as `order` FROM sub_menus WHERE parent_id = ? ORDER BY order_num ASC'
    ).bind(menuId).all();
    
    return corsResponse({ data: result.results });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleAddSubMenu(request, parentId, DB) {
  try {
    const body = await request.json();
    const pid = parseInt(parentId) || body.parent_id;
    
    // 检查父菜单是否存在
    const parent = await DB.prepare('SELECT id FROM menus WHERE id = ?').bind(pid).first();
    if (!parent) {
      return corsResponse({ error: '父菜单不存在' }, { status: 404 });
    }
    
    const result = await DB.prepare(
      'INSERT INTO sub_menus (parent_id, name, order_num) VALUES (?, ?, ?) RETURNING id, parent_id, name, order_num as `order`'
    ).bind(pid, body.name, body.order || 0).first();
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleUpdateSubMenu(id, request, DB) {
  try {
    const body = await request.json();
    const result = await DB.prepare(
      'UPDATE sub_menus SET name = ?, order_num = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, parent_id, name, order_num as `order`'
    ).bind(body.name, body.order, id).first();
    
    if (!result) {
      return corsResponse({ error: '子菜单不存在' }, { status: 404 });
    }
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleDeleteSubMenu(id, DB) {
  try {
    const result = await DB.prepare('DELETE FROM sub_menus WHERE id = ?').bind(id).run();
    
    if (result.changes === 0) {
      return corsResponse({ error: '子菜单不存在' }, { status: 404 });
    }
    
    return corsResponse({ data: {} });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

// 卡片 CRUD
async function handleGetCards(url, DB) {
  const menuId = url.searchParams.get('menuId');
  const subMenuId = url.searchParams.get('subMenuId');
  
  try {
    let query = 'SELECT id, menu_id, sub_menu_id, title, url, logo_url, custom_logo_path, description as desc, order_num as `order`, display_logo FROM cards';
    let params = [];
    
    if (menuId) {
      query += ' WHERE menu_id = ?';
      params.push(menuId);
      
      if (subMenuId) {
        query += ' AND sub_menu_id = ?';
        params.push(subMenuId);
      } else {
        query += ' AND (sub_menu_id IS NULL OR sub_menu_id = 0)';
      }
    }
    
    query += ' ORDER BY order_num ASC';
    
    const result = await DB.prepare(query).bind(...params).all();
    return corsResponse({ data: result.results });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleAddCard(request, DB) {
  try {
    const body = await request.json();
    const displayLogo = body.logo_url || body.url + '/favicon.ico';
    
    const result = await DB.prepare(
      'INSERT INTO cards (menu_id, sub_menu_id, title, url, logo_url, custom_logo_path, description, order_num, display_logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id, menu_id, sub_menu_id, title, url, logo_url, custom_logo_path, description as desc, order_num as `order`, display_logo'
    ).bind(
      body.menu_id,
      body.sub_menu_id || null,
      body.title,
      body.url,
      body.logo_url || '',
      body.custom_logo_path || null,
      body.desc || '',
      body.order || 0,
      displayLogo
    ).first();
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleUpdateCard(id, request, DB) {
  try {
    const body = await request.json();
    
    const existing = await DB.prepare('SELECT * FROM cards WHERE id = ?').bind(id).first();
    if (!existing) {
      return corsResponse({ error: '卡片不存在' }, { status: 404 });
    }
    
    const displayLogo = body.logo_url !== undefined ? (body.logo_url || body.url + '/favicon.ico') : existing.display_logo;
    
    const result = await DB.prepare(
      'UPDATE cards SET menu_id = ?, sub_menu_id = ?, title = ?, url = ?, logo_url = ?, custom_logo_path = ?, description = ?, order_num = ?, display_logo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, menu_id, sub_menu_id, title, url, logo_url, custom_logo_path, description as desc, order_num as `order`, display_logo'
    ).bind(
      body.menu_id !== undefined ? body.menu_id : existing.menu_id,
      body.sub_menu_id !== undefined ? body.sub_menu_id : existing.sub_menu_id,
      body.title !== undefined ? body.title : existing.title,
      body.url !== undefined ? body.url : existing.url,
      body.logo_url !== undefined ? body.logo_url : existing.logo_url,
      body.custom_logo_path !== undefined ? body.custom_logo_path : existing.custom_logo_path,
      body.desc !== undefined ? body.desc : existing.description,
      body.order !== undefined ? body.order : existing.order_num,
      displayLogo,
      id
    ).first();
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleDeleteCard(id, DB) {
  try {
    const result = await DB.prepare('DELETE FROM cards WHERE id = ?').bind(id).run();
    
    if (result.changes === 0) {
      return corsResponse({ error: '卡片不存在' }, { status: 404 });
    }
    
    return corsResponse({ data: {} });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

// 广告 CRUD
async function handleGetAds(DB) {
  try {
    const result = await DB.prepare('SELECT id, title, url, image_url, order_num as `order` FROM ads ORDER BY order_num ASC').all();
    return corsResponse({ data: result.results });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleAddAd(request, DB) {
  try {
    const body = await request.json();
    const result = await DB.prepare(
      'INSERT INTO ads (title, url, image_url, order_num) VALUES (?, ?, ?, ?) RETURNING id, title, url, image_url, order_num as `order`'
    ).bind(body.title, body.url, body.image_url || '', body.order || 0).first();
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleUpdateAd(id, request, DB) {
  try {
    const body = await request.json();
    const result = await DB.prepare(
      'UPDATE ads SET title = ?, url = ?, image_url = ?, order_num = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, title, url, image_url, order_num as `order`'
    ).bind(body.title, body.url, body.image_url || '', body.order, id).first();
    
    if (!result) {
      return corsResponse({ error: '广告不存在' }, { status: 404 });
    }
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleDeleteAd(id, DB) {
  try {
    const result = await DB.prepare('DELETE FROM ads WHERE id = ?').bind(id).run();
    
    if (result.changes === 0) {
      return corsResponse({ error: '广告不存在' }, { status: 404 });
    }
    
    return corsResponse({ data: {} });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

// 友情链接 CRUD
async function handleGetFriends(DB) {
  try {
    const result = await DB.prepare('SELECT id, name, url, logo_url, order_num as `order` FROM friends ORDER BY order_num ASC').all();
    return corsResponse({ data: result.results });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleAddFriend(request, DB) {
  try {
    const body = await request.json();
    const result = await DB.prepare(
      'INSERT INTO friends (name, url, logo_url, order_num) VALUES (?, ?, ?, ?) RETURNING id, name, url, logo_url, order_num as `order`'
    ).bind(body.name, body.url, body.logo_url || '', body.order || 0).first();
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleUpdateFriend(id, request, DB) {
  try {
    const body = await request.json();
    const result = await DB.prepare(
      'UPDATE friends SET name = ?, url = ?, logo_url = ?, order_num = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, name, url, logo_url, order_num as `order`'
    ).bind(body.name, body.url, body.logo_url || '', body.order, id).first();
    
    if (!result) {
      return corsResponse({ error: '友情链接不存在' }, { status: 404 });
    }
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleDeleteFriend(id, DB) {
  try {
    const result = await DB.prepare('DELETE FROM friends WHERE id = ?').bind(id).run();
    
    if (result.changes === 0) {
      return corsResponse({ error: '友情链接不存在' }, { status: 404 });
    }
    
    return corsResponse({ data: {} });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

// 用户 CRUD
async function handleGetUsers(DB) {
  try {
    const result = await DB.prepare('SELECT id, username FROM users').all();
    return corsResponse({ data: result.results });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleAddUser(request, DB) {
  try {
    const body = await request.json();
    
    // 检查用户名是否已存在
    const existing = await DB.prepare('SELECT id FROM users WHERE username = ?').bind(body.username).first();
    if (existing) {
      return corsResponse({ error: '用户名已存在' }, { status: 400 });
    }
    
    const result = await DB.prepare(
      'INSERT INTO users (username, password) VALUES (?, ?) RETURNING id, username'
    ).bind(body.username, body.password).first();
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleUpdateUser(id, request, DB) {
  try {
    const body = await request.json();
    const result = await DB.prepare(
      'UPDATE users SET username = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, username'
    ).bind(body.username, body.password, id).first();
    
    if (!result) {
      return corsResponse({ error: '用户不存在' }, { status: 404 });
    }
    
    return corsResponse({ data: result });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

async function handleDeleteUser(id, DB) {
  try {
    const result = await DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
    
    if (result.changes === 0) {
      return corsResponse({ error: '用户不存在' }, { status: 404 });
    }
    
    return corsResponse({ data: {} });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}

// 数据初始化
async function handleInitData(request, DB) {
  try {
    const body = await request.json();
    
    // 清空现有数据
    await DB.prepare('DELETE FROM cards').run();
    await DB.prepare('DELETE FROM sub_menus').run();
    await DB.prepare('DELETE FROM menus').run();
    await DB.prepare('DELETE FROM ads').run();
    await DB.prepare('DELETE FROM friends').run();
    
    // 插入菜单
    if (body.menus) {
      for (const menu of body.menus) {
        const result = await DB.prepare(
          'INSERT INTO menus (id, name, order_num) VALUES (?, ?, ?)'
        ).bind(menu.id, menu.name, menu.order).run();
        
        // 插入子菜单
        if (menu.subMenus && menu.subMenus.length > 0) {
          for (const sub of menu.subMenus) {
            await DB.prepare(
              'INSERT INTO sub_menus (id, parent_id, name, order_num) VALUES (?, ?, ?, ?)'
            ).bind(sub.id, menu.id, sub.name, sub.order).run();
          }
        }
      }
    }
    
    // 插入卡片
    if (body.cards) {
      // 支持两种格式：数组格式和对象格式
      if (Array.isArray(body.cards)) {
        // 数组格式：直接遍历
        for (const card of body.cards) {
          await DB.prepare(
            'INSERT INTO cards (id, menu_id, sub_menu_id, title, url, logo_url, custom_logo_path, description, order_num, display_logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
          ).bind(
            card.id,
            card.menu_id,
            card.sub_menu_id || null,
            card.title,
            card.url,
            card.logo_url || '',
            card.custom_logo_path || null,
            card.desc || '',
            card.order || 0,
            card.display_logo || card.logo_url || card.url + '/favicon.ico'
          ).run();
        }
      } else {
        // 对象格式：按菜单ID分组
        for (const [key, cardList] of Object.entries(body.cards)) {
          for (const card of cardList) {
            await DB.prepare(
              'INSERT INTO cards (id, menu_id, sub_menu_id, title, url, logo_url, custom_logo_path, description, order_num, display_logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            ).bind(
              card.id,
              card.menu_id,
              card.sub_menu_id || null,
              card.title,
              card.url,
              card.logo_url || '',
              card.custom_logo_path || null,
              card.desc || '',
              card.order || 0,
              card.display_logo || card.logo_url || card.url + '/favicon.ico'
            ).run();
          }
        }
      }
    }
    
    // 插入广告
    if (body.ads) {
      for (const ad of body.ads) {
        await DB.prepare(
          'INSERT INTO ads (id, title, url, image_url, order_num) VALUES (?, ?, ?, ?, ?)'
        ).bind(ad.id, ad.title, ad.url, ad.image_url || '', ad.order || 0).run();
      }
    }
    
    // 插入友情链接
    if (body.friends) {
      for (const friend of body.friends) {
        await DB.prepare(
          'INSERT INTO friends (id, name, url, logo_url, order_num) VALUES (?, ?, ?, ?, ?)'
        ).bind(friend.id, friend.name, friend.url, friend.logo_url || '', friend.order || 0).run();
      }
    }
    
    // 插入用户（如果不存在）
    if (body.users) {
      for (const user of body.users) {
        const existing = await DB.prepare('SELECT id FROM users WHERE username = ?').bind(user.username).first();
        if (!existing) {
          await DB.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)').bind(user.id, user.username, user.password).run();
        }
      }
    }
    
    return corsResponse({ data: { success: true, message: '数据初始化成功' } });
  } catch (error) {
    return corsResponse({ error: '服务器错误: ' + error.message }, { status: 500 });
  }
}