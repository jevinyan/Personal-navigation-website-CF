-- 清空现有数据
DELETE FROM cards;
DELETE FROM sub_menus;
DELETE FROM menus;
DELETE FROM friends;

-- 插入菜单
INSERT INTO menus (id, name, order_num) VALUES
(1, 'Home', 1),
(2, 'Ai-stuff', 2),
(3, 'Cloud', 3),
(8, 'Container', 4),
(4, 'Software', 5),
(5, 'Tools', 6),
(6, 'Mail & Domain', 7),
(11, 'Dev', 8);

-- 插入子菜单
INSERT INTO sub_menus (id, parent_id, name, order_num) VALUES
(1, 8, 'Game Server', 1),
(5, 4, 'Proxy', 1),
(3, 4, 'Macos', 2),
(6, 5, 'Free SMS', 1),
(7, 5, 'Other', 2);

-- 插入卡片
INSERT INTO cards (id, menu_id, sub_menu_id, title, url, logo_url, order_num) VALUES
(1, 1, NULL, 'ChatGPT', 'https://chat.openai.com', 'https://chat.openai.com/favicon.ico', 1),
(2, 1, NULL, 'Gemini', 'https://gemini.google.com', 'https://gemini.google.com/favicon.ico', 2),
(3, 1, NULL, 'Claude', 'https://claude.ai', 'https://claude.ai/favicon.ico', 3),
(4, 1, NULL, 'Perplexity', 'https://www.perplexity.ai', 'https://www.perplexity.ai/favicon.ico', 4),
(5, 1, NULL, 'DeepSeek', 'https://chat.deepseek.com', 'https://chat.deepseek.com/favicon.ico', 5),
(6, 1, NULL, 'DALL-E', 'https://labs.openai.com', 'https://labs.openai.com/favicon.ico', 6),
(7, 1, NULL, 'Midjourney', 'https://www.midjourney.com', 'https://www.midjourney.com/favicon.ico', 7),
(8, 1, NULL, 'Stable Diffusion', 'https://stablediffusionweb.com', 'https://stablediffusionweb.com/favicon.ico', 8),
(9, 2, NULL, 'Notion AI', 'https://www.notion.so', 'https://www.notion.so/favicon.ico', 1),
(10, 2, NULL, 'GitHub Copilot', 'https://github.com/features/copilot', 'https://github.com/favicon.ico', 2),
(11, 2, NULL, 'Cursor', 'https://www.cursor.so', 'https://www.cursor.so/favicon.ico', 3),
(12, 2, NULL, 'Codeium', 'https://codeium.com', 'https://codeium.com/favicon.ico', 4),
(13, 2, NULL, 'ChatPDF', 'https://www.chatpdf.com', 'https://www.chatpdf.com/favicon.ico', 5),
(14, 2, NULL, 'Ollama', 'https://ollama.com', 'https://ollama.com/favicon.ico', 6),
(15, 2, NULL, 'LM Studio', 'https://lmstudio.ai', 'https://lmstudio.ai/favicon.ico', 7),
(16, 2, NULL, 'GPT4All', 'https://gpt4all.io', 'https://gpt4all.io/favicon.ico', 8),
(17, 3, NULL, 'Cloudflare', 'https://dash.cloudflare.com', 'https://dash.cloudflare.com/favicon.ico', 1),
(18, 3, NULL, 'Vercel', 'https://vercel.com', 'https://vercel.com/favicon.ico', 2),
(19, 3, NULL, 'Netlify', 'https://app.netlify.com', 'https://app.netlify.com/favicon.ico', 3),
(20, 3, NULL, 'Render', 'https://dashboard.render.com', 'https://dashboard.render.com/favicon.ico', 4),
(21, 3, NULL, 'Railway', 'https://railway.app', 'https://railway.app/favicon.ico', 5),
(22, 3, NULL, 'Fly.io', 'https://fly.io', 'https://fly.io/favicon.ico', 6),
(23, 3, NULL, 'Heroku', 'https://dashboard.heroku.com', 'https://dashboard.heroku.com/favicon.ico', 7),
(24, 3, NULL, 'AWS Console', 'https://console.aws.amazon.com', 'https://console.aws.amazon.com/favicon.ico', 8),
(25, 8, NULL, 'Docker Hub', 'https://hub.docker.com', 'https://hub.docker.com/favicon.ico', 1),
(26, 8, NULL, 'GitHub Container', 'https://github.com/features/packages', 'https://github.com/favicon.ico', 2),
(27, 8, NULL, 'Kubernetes', 'https://kubernetes.io', 'https://kubernetes.io/favicon.ico', 3),
(28, 8, NULL, 'Portainer', 'https://www.portainer.io', 'https://www.portainer.io/favicon.ico', 4),
(29, 8, 1, 'Pterodactyl', 'https://pterodactyl.io', 'https://pterodactyl.io/favicon.ico', 1),
(30, 8, 1, 'AMPPS', 'https://www.ampps.com', 'https://www.ampps.com/favicon.ico', 2),
(31, 4, NULL, 'VS Code', 'https://code.visualstudio.com', 'https://code.visualstudio.com/favicon.ico', 1),
(32, 4, NULL, 'WebStorm', 'https://www.jetbrains.com/webstorm', 'https://www.jetbrains.com/webstorm/favicon.ico', 2),
(33, 4, NULL, 'PyCharm', 'https://www.jetbrains.com/pycharm', 'https://www.jetbrains.com/pycharm/favicon.ico', 3),
(34, 4, NULL, 'Figma', 'https://www.figma.com', 'https://www.figma.com/favicon.ico', 4),
(35, 4, 5, 'Clash', 'https://github.com/Fndroid/clash_for_windows_pkg', 'https://github.com/favicon.ico', 1),
(36, 4, 5, 'V2rayN', 'https://github.com/2dust/v2rayN', 'https://github.com/favicon.ico', 2),
(37, 4, 5, 'Surfboard', 'https://github.com/auspicious3000/surfboard', 'https://github.com/favicon.ico', 3),
(38, 4, 3, 'Homebrew', 'https://brew.sh', 'https://brew.sh/favicon.ico', 1),
(39, 4, 3, 'MacPorts', 'https://www.macports.org', 'https://www.macports.org/favicon.ico', 2),
(40, 4, 3, 'Mas', 'https://github.com/mas-cli/mas', 'https://github.com/favicon.ico', 3),
(41, 5, NULL, 'Canva', 'https://www.canva.com', 'https://www.canva.com/favicon.ico', 1),
(42, 5, NULL, 'Notion', 'https://www.notion.so', 'https://www.notion.so/favicon.ico', 2),
(43, 5, NULL, 'Trello', 'https://trello.com', 'https://trello.com/favicon.ico', 3),
(44, 5, NULL, 'Airtable', 'https://airtable.com', 'https://airtable.com/favicon.ico', 4),
(45, 5, 6, 'Twilio', 'https://console.twilio.com', 'https://console.twilio.com/favicon.ico', 1),
(46, 5, 6, 'Plivo', 'https://manage.plivo.com', 'https://manage.plivo.com/favicon.ico', 2),
(47, 5, 6, 'Nexmo', 'https://dashboard.nexmo.com', 'https://dashboard.nexmo.com/favicon.ico', 3),
(48, 5, 7, 'Markdown Guide', 'https://www.markdownguide.org', 'https://www.markdownguide.org/favicon.ico', 1),
(49, 5, 7, 'Regex101', 'https://regex101.com', 'https://regex101.com/favicon.ico', 2),
(50, 5, 7, 'JSON Editor', 'https://jsoneditoronline.org', 'https://jsoneditoronline.org/favicon.ico', 3),
(51, 6, NULL, 'Gmail', 'https://mail.google.com', 'https://mail.google.com/favicon.ico', 1),
(52, 6, NULL, 'Outlook', 'https://outlook.live.com', 'https://outlook.live.com/favicon.ico', 2),
(53, 6, NULL, 'ProtonMail', 'https://proton.me/mail', 'https://proton.me/favicon.ico', 3),
(54, 6, NULL, 'Namecheap', 'https://www.namecheap.com', 'https://www.namecheap.com/favicon.ico', 4),
(55, 6, NULL, 'Cloudflare Registrar', 'https://dash.cloudflare.com', 'https://dash.cloudflare.com/favicon.ico', 5),
(56, 6, NULL, 'Dynadot', 'https://www.dynadot.com', 'https://www.dynadot.com/favicon.ico', 6),
(57, 11, NULL, 'GitHub', 'https://github.com', 'https://github.com/favicon.ico', 1),
(58, 11, NULL, 'GitLab', 'https://gitlab.com', 'https://gitlab.com/favicon.ico', 2),
(59, 11, NULL, 'Bitbucket', 'https://bitbucket.org', 'https://bitbucket.org/favicon.ico', 3),
(60, 11, NULL, 'Stack Overflow', 'https://stackoverflow.com', 'https://stackoverflow.com/favicon.ico', 4),
(61, 11, NULL, 'Dev.to', 'https://dev.to', 'https://dev.to/favicon.ico', 5),
(62, 11, NULL, 'Medium', 'https://medium.com', 'https://medium.com/favicon.ico', 6),
(63, 11, NULL, 'npm', 'https://www.npmjs.com', 'https://www.npmjs.com/favicon.ico', 7),
(64, 11, NULL, 'PyPI', 'https://pypi.org', 'https://pypi.org/favicon.ico', 8);

-- 插入友情链接
INSERT INTO friends (id, name, url, logo_url, order_num) VALUES
(1, 'Noodseek图床', 'https://www.nodeimage.com', 'https://www.nodeseek.com/static/image/favicon/favicon-32x32.png', 1),
(2, 'Serv00 status', 'https://status.eooce.com', 'https://www.serv00.com/static/ct8/img/logo.jpg', 2),
(3, 'Serv00自动安装面板', 'https://serv00.eooce.com', 'https://www.serv00.com/static/ct8/img/logo.jpg', 3),
(4, 'ip6.arpa自动添加SSL证书', 'https://ssl.eooce.xx.kg', '', 4);