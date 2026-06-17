import request from './utils/request';

// 备用静态数据加载函数
const loadStaticData = async () => {
  try {
    const response = await fetch('/static-data.json');
    return await response.json();
  } catch (error) {
    console.error('Failed to load static data:', error);
    return null;
  }
};

let staticData = null;

// 登录
export const login = async (username, password) => {
  try {
    return await request.post('/auth/login', { username, password });
  } catch (error) {
    console.error('Login error:', error);
    return { error: '网络错误' };
  }
};

// 登出
export const logout = async () => {
  try {
    const result = await request.post('/auth/logout');
    localStorage.removeItem('token');
    return result;
  } catch (error) {
    localStorage.removeItem('token');
    return { data: {} };
  }
};

// 菜单管理
export const getMenus = async () => {
  try {
    return await request.get('/menus');
  } catch (error) {
    console.error('Get menus error, falling back to static data:', error);
    // 尝试加载静态数据
    if (!staticData) {
      staticData = await loadStaticData();
    }
    return staticData ? { data: staticData.menus } : { data: [] };
  }
};

export const addMenu = async (data) => {
  try {
    return await request.post('/menus', data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const updateMenu = async (id, data) => {
  try {
    return await request.put(`/menus/${id}`, data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const deleteMenu = async (id) => {
  try {
    return await request.delete(`/menus/${id}`);
  } catch (error) {
    return { error: '网络错误' };
  }
};

// 子菜单管理（与原有API路径一致）
export const getSubMenus = async (menuId) => {
  try {
    return await request.get(`/menus/${menuId}/submenus`);
  } catch (error) {
    return { data: [] };
  }
};

export const addSubMenu = async (parent_id, data) => {
  try {
    return await request.post(`/menus/${parent_id}/submenus`, data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const updateSubMenu = async (id, data) => {
  try {
    return await request.put(`/menus/submenus/${id}`, data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const deleteSubMenu = async (id) => {
  try {
    return await request.delete(`/menus/submenus/${id}`);
  } catch (error) {
    return { error: '网络错误' };
  }
};

// 卡片管理
export const getCards = async (menuId, subMenuId = null) => {
  try {
    let url = `/cards?menuId=${menuId}`;
    if (subMenuId !== null && subMenuId !== undefined) {
      url += `&subMenuId=${subMenuId}`;
    }
    const data = await request.get(url);
    data.data.forEach(card => {
      if (!card.custom_logo_path) {
        card.display_logo = card.logo_url || (card.url.replace(/\/+$/, '') + '/favicon.ico');
      } else {
        card.display_logo = '/uploads/' + card.custom_logo_path;
      }
    });
    return data;
  } catch (error) {
    console.error('Get cards error, falling back to static data:', error);
    // 尝试加载静态数据
    if (!staticData) {
      staticData = await loadStaticData();
    }
    if (staticData && staticData.cards) {
      // 静态数据中的cards是按menu_id分组的对象
      const menuCards = staticData.cards[menuId] || [];
      // 如果有子菜单ID，过滤子菜单卡片
      let filteredCards = menuCards;
      if (subMenuId !== null && subMenuId !== undefined) {
        filteredCards = menuCards.filter(card => card.sub_menu_id === subMenuId);
      }
      // 设置display_logo
      filteredCards.forEach(card => {
        if (!card.custom_logo_path) {
          card.display_logo = card.logo_url || (card.url.replace(/\/+$/, '') + '/favicon.ico');
        } else {
          card.display_logo = '/uploads/' + card.custom_logo_path;
        }
      });
      return { data: filteredCards };
    }
    return { data: [] };
  }
};

export const addCard = async (data) => {
  try {
    return await request.post('/cards', data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const updateCard = async (id, data) => {
  try {
    return await request.put(`/cards/${id}`, data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const deleteCard = async (id) => {
  try {
    return await request.delete(`/cards/${id}`);
  } catch (error) {
    return { error: '网络错误' };
  }
};

// Logo上传（简化实现，实际需要Cloudflare R2存储）
export const uploadLogo = async (file) => {
  try {
    // 由于Cloudflare Pages静态托管限制，Logo上传需要使用外部存储
    // 这里返回默认Logo地址
    return { data: { url: '/uploads/default-favicon.png' } };
  } catch (error) {
    return { error: '上传失败' };
  }
};

// 广告管理
export const getAds = async () => {
  try {
    return await request.get('/ads');
  } catch (error) {
    console.error('Get ads error, falling back to static data:', error);
    if (!staticData) {
      staticData = await loadStaticData();
    }
    return staticData ? { data: staticData.ads || [] } : { data: [] };
  }
};

export const addAd = async (data) => {
  try {
    return await request.post('/ads', data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const updateAd = async (id, data) => {
  try {
    return await request.put(`/ads/${id}`, data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const deleteAd = async (id) => {
  try {
    return await request.delete(`/ads/${id}`);
  } catch (error) {
    return { error: '网络错误' };
  }
};

// 友情链接管理
export const getFriends = async () => {
  try {
    return await request.get('/friends');
  } catch (error) {
    console.error('Get friends error, falling back to static data:', error);
    if (!staticData) {
      staticData = await loadStaticData();
    }
    // 将静态数据中的字段映射为前端期望的格式
    if (staticData && staticData.friends) {
      const mappedFriends = staticData.friends.map(f => ({
        ...f,
        title: f.name,
        logo: f.logo_url
      }));
      return { data: mappedFriends };
    }
    return { data: [] };
  }
};

export const addFriend = async (data) => {
  try {
    return await request.post('/friends', data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const updateFriend = async (id, data) => {
  try {
    return await request.put(`/friends/${id}`, data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const deleteFriend = async (id) => {
  try {
    return await request.delete(`/friends/${id}`);
  } catch (error) {
    return { error: '网络错误' };
  }
};

// 用户管理
export const getUserProfile = async () => {
  try {
    return await request.get('/users/me');
  } catch (error) {
    return { data: { username: 'admin' } };
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    return await request.put('/users/me/password', {
      currentPassword: oldPassword,
      newPassword: newPassword
    });
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    return await request.get('/users');
  } catch (error) {
    return { data: [] };
  }
};

export const addUser = async (data) => {
  try {
    return await request.post('/users', data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const updateUser = async (id, data) => {
  try {
    return await request.put(`/users/${id}`, data);
  } catch (error) {
    return { error: '网络错误' };
  }
};

export const deleteUser = async (id) => {
  try {
    return await request.delete(`/users/${id}`);
  } catch (error) {
    return { error: '网络错误' };
  }
};