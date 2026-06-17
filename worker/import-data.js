const https = require('https');

const initData = {
  menus: [
    {"id":1,"name":"Home","order":1,"subMenus":[]},
    {"id":2,"name":"Ai-stuff","order":2,"subMenus":[]},
    {"id":3,"name":"Cloud","order":3,"subMenus":[]},
    {"id":8,"name":"Container","order":4,"subMenus":[{"id":1,"parent_id":8,"name":"Game Server","order":1}]},
    {"id":4,"name":"Software","order":5,"subMenus":[{"id":5,"parent_id":4,"name":"Proxy","order":1},{"id":3,"parent_id":4,"name":"Macos","order":2}]},
    {"id":5,"name":"Tools","order":6,"subMenus":[{"id":6,"parent_id":5,"name":"Free SMS","order":1},{"id":7,"parent_id":5,"name":"Other","order":2}]},
    {"id":6,"name":"Mail & Domain","order":7,"subMenus":[]},
    {"id":11,"name":"Dev","order":8,"subMenus":[]}
  ],
  cards: [
    {"id":1,"menu_id":1,"sub_menu_id":null,"title":"ChatGPT","url":"https://chat.openai.com","logo_url":"https://chat.openai.com/favicon.ico","order":1},
    {"id":2,"menu_id":1,"sub_menu_id":null,"title":"Gemini","url":"https://gemini.google.com","logo_url":"https://gemini.google.com/favicon.ico","order":2},
    {"id":3,"menu_id":1,"sub_menu_id":null,"title":"Claude","url":"https://claude.ai","logo_url":"https://claude.ai/favicon.ico","order":3},
    {"id":4,"menu_id":1,"sub_menu_id":null,"title":"Perplexity","url":"https://www.perplexity.ai","logo_url":"https://www.perplexity.ai/favicon.ico","order":4},
    {"id":5,"menu_id":1,"sub_menu_id":null,"title":"DeepSeek","url":"https://chat.deepseek.com","logo_url":"https://chat.deepseek.com/favicon.ico","order":5},
    {"id":6,"menu_id":1,"sub_menu_id":null,"title":"DALL-E","url":"https://labs.openai.com","logo_url":"https://labs.openai.com/favicon.ico","order":6},
    {"id":7,"menu_id":1,"sub_menu_id":null,"title":"Midjourney","url":"https://www.midjourney.com","logo_url":"https://www.midjourney.com/favicon.ico","order":7},
    {"id":8,"menu_id":1,"sub_menu_id":null,"title":"Stable Diffusion","url":"https://stablediffusionweb.com","logo_url":"https://stablediffusionweb.com/favicon.ico","order":8},
    {"id":9,"menu_id":2,"sub_menu_id":null,"title":"Notion AI","url":"https://www.notion.so","logo_url":"https://www.notion.so/favicon.ico","order":1},
    {"id":10,"menu_id":2,"sub_menu_id":null,"title":"GitHub Copilot","url":"https://github.com/features/copilot","logo_url":"https://github.com/favicon.ico","order":2},
    {"id":11,"menu_id":2,"sub_menu_id":null,"title":"Cursor","url":"https://www.cursor.so","logo_url":"https://www.cursor.so/favicon.ico","order":3},
    {"id":12,"menu_id":2,"sub_menu_id":null,"title":"Codeium","url":"https://codeium.com","logo_url":"https://codeium.com/favicon.ico","order":4},
    {"id":13,"menu_id":2,"sub_menu_id":null,"title":"ChatPDF","url":"https://www.chatpdf.com","logo_url":"https://www.chatpdf.com/favicon.ico","order":5},
    {"id":14,"menu_id":2,"sub_menu_id":null,"title":"Ollama","url":"https://ollama.com","logo_url":"https://ollama.com/favicon.ico","order":6},
    {"id":15,"menu_id":2,"sub_menu_id":null,"title":"LM Studio","url":"https://lmstudio.ai","logo_url":"https://lmstudio.ai/favicon.ico","order":7},
    {"id":16,"menu_id":2,"sub_menu_id":null,"title":"GPT4All","url":"https://gpt4all.io","logo_url":"https://gpt4all.io/favicon.ico","order":8},
    {"id":17,"menu_id":3,"sub_menu_id":null,"title":"Cloudflare","url":"https://dash.cloudflare.com","logo_url":"https://dash.cloudflare.com/favicon.ico","order":1},
    {"id":18,"menu_id":3,"sub_menu_id":null,"title":"Vercel","url":"https://vercel.com","logo_url":"https://vercel.com/favicon.ico","order":2},
    {"id":19,"menu_id":3,"sub_menu_id":null,"title":"Netlify","url":"https://app.netlify.com","logo_url":"https://app.netlify.com/favicon.ico","order":3},
    {"id":20,"menu_id":3,"sub_menu_id":null,"title":"Render","url":"https://dashboard.render.com","logo_url":"https://dashboard.render.com/favicon.ico","order":4},
    {"id":21,"menu_id":3,"sub_menu_id":null,"title":"Railway","url":"https://railway.app","logo_url":"https://railway.app/favicon.ico","order":5},
    {"id":22,"menu_id":3,"sub_menu_id":null,"title":"Fly.io","url":"https://fly.io","logo_url":"https://fly.io/favicon.ico","order":6},
    {"id":23,"menu_id":3,"sub_menu_id":null,"title":"Heroku","url":"https://dashboard.heroku.com","logo_url":"https://dashboard.heroku.com/favicon.ico","order":7},
    {"id":24,"menu_id":3,"sub_menu_id":null,"title":"AWS Console","url":"https://console.aws.amazon.com","logo_url":"https://console.aws.amazon.com/favicon.ico","order":8},
    {"id":25,"menu_id":8,"sub_menu_id":null,"title":"Docker Hub","url":"https://hub.docker.com","logo_url":"https://hub.docker.com/favicon.ico","order":1},
    {"id":26,"menu_id":8,"sub_menu_id":null,"title":"GitHub Container","url":"https://github.com/features/packages","logo_url":"https://github.com/favicon.ico","order":2},
    {"id":27,"menu_id":8,"sub_menu_id":null,"title":"Kubernetes","url":"https://kubernetes.io","logo_url":"https://kubernetes.io/favicon.ico","order":3},
    {"id":28,"menu_id":8,"sub_menu_id":null,"title":"Portainer","url":"https://www.portainer.io","logo_url":"https://www.portainer.io/favicon.ico","order":4},
    {"id":29,"menu_id":8,"sub_menu_id":1,"title":"Pterodactyl","url":"https://pterodactyl.io","logo_url":"https://pterodactyl.io/favicon.ico","order":1},
    {"id":30,"menu_id":8,"sub_menu_id":1,"title":"AMPPS","url":"https://www.ampps.com","logo_url":"https://www.ampps.com/favicon.ico","order":2},
    {"id":31,"menu_id":4,"sub_menu_id":null,"title":"VS Code","url":"https://code.visualstudio.com","logo_url":"https://code.visualstudio.com/favicon.ico","order":1},
    {"id":32,"menu_id":4,"sub_menu_id":null,"title":"WebStorm","url":"https://www.jetbrains.com/webstorm","logo_url":"https://www.jetbrains.com/webstorm/favicon.ico","order":2},
    {"id":33,"menu_id":4,"sub_menu_id":null,"title":"PyCharm","url":"https://www.jetbrains.com/pycharm","logo_url":"https://www.jetbrains.com/pycharm/favicon.ico","order":3},
    {"id":34,"menu_id":4,"sub_menu_id":null,"title":"Figma","url":"https://www.figma.com","logo_url":"https://www.figma.com/favicon.ico","order":4},
    {"id":35,"menu_id":4,"sub_menu_id":5,"title":"Clash","url":"https://github.com/Fndroid/clash_for_windows_pkg","logo_url":"https://github.com/favicon.ico","order":1},
    {"id":36,"menu_id":4,"sub_menu_id":5,"title":"V2rayN","url":"https://github.com/2dust/v2rayN","logo_url":"https://github.com/favicon.ico","order":2},
    {"id":37,"menu_id":4,"sub_menu_id":5,"title":"Surfboard","url":"https://github.com/auspicious3000/surfboard","logo_url":"https://github.com/favicon.ico","order":3},
    {"id":38,"menu_id":4,"sub_menu_id":3,"title":"Homebrew","url":"https://brew.sh","logo_url":"https://brew.sh/favicon.ico","order":1},
    {"id":39,"menu_id":4,"sub_menu_id":3,"title":"MacPorts","url":"https://www.macports.org","logo_url":"https://www.macports.org/favicon.ico","order":2},
    {"id":40,"menu_id":4,"sub_menu_id":3,"title":"Mas","url":"https://github.com/mas-cli/mas","logo_url":"https://github.com/favicon.ico","order":3},
    {"id":41,"menu_id":5,"sub_menu_id":null,"title":"Canva","url":"https://www.canva.com","logo_url":"https://www.canva.com/favicon.ico","order":1},
    {"id":42,"menu_id":5,"sub_menu_id":null,"title":"Notion","url":"https://www.notion.so","logo_url":"https://www.notion.so/favicon.ico","order":2},
    {"id":43,"menu_id":5,"sub_menu_id":null,"title":"Trello","url":"https://trello.com","logo_url":"https://trello.com/favicon.ico","order":3},
    {"id":44,"menu_id":5,"sub_menu_id":null,"title":"Airtable","url":"https://airtable.com","logo_url":"https://airtable.com/favicon.ico","order":4},
    {"id":45,"menu_id":5,"sub_menu_id":6,"title":"Twilio","url":"https://console.twilio.com","logo_url":"https://console.twilio.com/favicon.ico","order":1},
    {"id":46,"menu_id":5,"sub_menu_id":6,"title":"Plivo","url":"https://manage.plivo.com","logo_url":"https://manage.plivo.com/favicon.ico","order":2},
    {"id":47,"menu_id":5,"sub_menu_id":6,"title":"Nexmo","url":"https://dashboard.nexmo.com","logo_url":"https://dashboard.nexmo.com/favicon.ico","order":3},
    {"id":48,"menu_id":5,"sub_menu_id":7,"title":"Markdown Guide","url":"https://www.markdownguide.org","logo_url":"https://www.markdownguide.org/favicon.ico","order":1},
    {"id":49,"menu_id":5,"sub_menu_id":7,"title":"Regex101","url":"https://regex101.com","logo_url":"https://regex101.com/favicon.ico","order":2},
    {"id":50,"menu_id":5,"sub_menu_id":7,"title":"JSON Editor","url":"https://jsoneditoronline.org","logo_url":"https://jsoneditoronline.org/favicon.ico","order":3},
    {"id":51,"menu_id":6,"sub_menu_id":null,"title":"Gmail","url":"https://mail.google.com","logo_url":"https://mail.google.com/favicon.ico","order":1},
    {"id":52,"menu_id":6,"sub_menu_id":null,"title":"Outlook","url":"https://outlook.live.com","logo_url":"https://outlook.live.com/favicon.ico","order":2},
    {"id":53,"menu_id":6,"sub_menu_id":null,"title":"ProtonMail","url":"https://proton.me/mail","logo_url":"https://proton.me/favicon.ico","order":3},
    {"id":54,"menu_id":6,"sub_menu_id":null,"title":"Namecheap","url":"https://www.namecheap.com","logo_url":"https://www.namecheap.com/favicon.ico","order":4},
    {"id":55,"menu_id":6,"sub_menu_id":null,"title":"Cloudflare Registrar","url":"https://dash.cloudflare.com","logo_url":"https://dash.cloudflare.com/favicon.ico","order":5},
    {"id":56,"menu_id":6,"sub_menu_id":null,"title":"Dynadot","url":"https://www.dynadot.com","logo_url":"https://www.dynadot.com/favicon.ico","order":6},
    {"id":57,"menu_id":11,"sub_menu_id":null,"title":"GitHub","url":"https://github.com","logo_url":"https://github.com/favicon.ico","order":1},
    {"id":58,"menu_id":11,"sub_menu_id":null,"title":"GitLab","url":"https://gitlab.com","logo_url":"https://gitlab.com/favicon.ico","order":2},
    {"id":59,"menu_id":11,"sub_menu_id":null,"title":"Bitbucket","url":"https://bitbucket.org","logo_url":"https://bitbucket.org/favicon.ico","order":3},
    {"id":60,"menu_id":11,"sub_menu_id":null,"title":"Stack Overflow","url":"https://stackoverflow.com","logo_url":"https://stackoverflow.com/favicon.ico","order":4},
    {"id":61,"menu_id":11,"sub_menu_id":null,"title":"Dev.to","url":"https://dev.to","logo_url":"https://dev.to/favicon.ico","order":5},
    {"id":62,"menu_id":11,"sub_menu_id":null,"title":"Medium","url":"https://medium.com","logo_url":"https://medium.com/favicon.ico","order":6},
    {"id":63,"menu_id":11,"sub_menu_id":null,"title":"npm","url":"https://www.npmjs.com","logo_url":"https://www.npmjs.com/favicon.ico","order":7},
    {"id":64,"menu_id":11,"sub_menu_id":null,"title":"PyPI","url":"https://pypi.org","logo_url":"https://pypi.org/favicon.ico","order":8}
  ],
  friends: [
    {"id":1,"name":"Noodseek图床","url":"https://www.nodeimage.com","logo_url":"https://www.nodeseek.com/static/image/favicon/favicon-32x32.png"},
    {"id":2,"name":"Serv00 status","url":"https://status.eooce.com","logo_url":"https://www.serv00.com/static/ct8/img/logo.jpg"},
    {"id":3,"name":"Serv00自动安装面板","url":"https://serv00.eooce.com","logo_url":"https://www.serv00.com/static/ct8/img/logo.jpg"},
    {"id":4,"name":"ip6.arpa自动添加SSL证书","url":"https://ssl.eooce.xx.kg","logo_url":""}
  ]
};

const data = JSON.stringify(initData);

const options = {
  hostname: 'nav-item-worker.8361048.workers.dev',
  port: 443,
  path: '/api/init',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'x-admin-secret': 'nav-admin-secret-key'
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseBody);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();