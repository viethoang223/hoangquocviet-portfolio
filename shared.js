const HQVShared={auth:null,emitters:new Map(),on(evt,fn){if(!this.emitters.has(evt))this.emitters.set(evt,new Set());this.emitters.get(evt).add(fn);return()=>this.emitters.get(evt)?.delete(fn)},emit(evt){for(const fn of this.emitters.get(evt)||[])fn()}};
const CONFIG={
    email: '',
    status: 'Đang mở cho cơ hội mới',
    links: {},
    supabase: {
      url: 'https://houdsljwpqgzbrpnaytd.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdWRzbGp3cHFnemJycG5heXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzU2OTcsImV4cCI6MjEwNTkxMTY5N30.vVdnQIeQhHZOJ22qC8xmHnXBsAUlhdgIWUse3MQFgUc',
      bucket: 'portfolio-proofs',
      assetTable: 'portfolio_proofs'
    }
  };
const I18N={vi:{'nav.projects':'Dự án','nav.insights':'Insights','nav.skills':'Năng lực','nav.experience':'Kinh nghiệm','nav.contact':'Liên hệ','nav.cta':'Nhắn tin','hero.projects':'Xem dự án','hero.contact':'Trao đổi bài toán','status':'Sẵn sàng tự động hóa mọi quy trình thủ công nhàm chán^^','approach.eyebrow':'Cách mà tôi hình dung, và làm việc','approach.resultTitle':'Marketing Operations','approach.lead':'Mình tập trung vào cách công nghệ biến một vấn đề Marketing thành quy trình có thể vận hành, đo lường, chuẩn hóa và cải thiện liên tục.','formula.marketing':'Marketing','formula.marketingMicro':'hiểu người mua và câu chuyện sau con số','formula.data':'Data','formula.dataMicro':'kiểm chứng điều mình đoán bằng dữ liệu thật','formula.ai':'AI','formula.aiMicro':'đẩy nhanh phân tích, tạo nội dung và xử lý','formula.auto':'Automation','formula.autoMicro':'để phần việc lặp lại chạy đúng và có cấu trúc','formula.result':'Marketing Operations — vận hành được · đo lường được · tối ưu được','process.kicker':'Working loop','process.1':'Marketing Problem','process.2':'Research / Data','process.3':'Process Design','process.4':'AI / Automation','process.5':'Workflow / System','process.6':'Structured Output → Decision → Measurement','projects.eyebrow':'Selected work','projects.heading':'Những mô hình mà mình đã dựng','projects.headingAccent':'để tối ưu chuyển đổi và tự động hóa.','projects.lead':'Mình dành rất nhiều thời gian để tiếp xúc và hiểu ra cách vận hành của nhiều công cụ cũng như các thuật toán AI, sau đó mình tìm cách kết hợp và tự động hóa chúng lại với nhau. Ngoài ra, mình còn nhiều các dự án khác đóng vai trò là nền tảng Martech của mình sau này...','project.open':'Mở case study','insights.eyebrow':'Insights','insights.heading':'Góc nhìn','insights.headingAccent':'MarTech & AI.','insights.lead':'Những bài phân tích, tech breakdown và ghi chú nghiên cứu về cách tôi nhìn công nghệ, dữ liệu và Marketing.','skills.eyebrow':'Hành trang','skills.heading':'Tư duy & Công cụ','skills.headingAccent':'mà mình đã có và hiểu về nó :D','skills.lead':'Bốn mảnh ghép kỹ năng mà mình kết hợp để tối ưu hóa mọi bài toán vận hành: Marketing, Data, AI và Automation.','experience.eyebrow':'Kinh nghiệm % chứng chỉ','experience.heading':'Những trải nghiệm quý giá','experience.headingAccent':'và vài thành tựu nhỏ xinh^^','experience.copy':'Kết hợp giữa kinh nghiệm điều phối thực chiến, vận hành dự án truyền thông và hệ thống chứng chỉ chuyên môn quốc tế về AI, dữ liệu và MarTech.','experience.roleProof':'Communications role','exp.communication':'Communication','exp.design':'Design','exp.video':'Video','exp.trends':'Trends & Analysis','exp.campaign':'Campaign Execution','exp.coordination':'Coordination','cert.anthropic':'Anthropic','cert.marketing':'Marketing & Analytics','cert.english':'English','extra.creative':'Creative','extra.direction':'Working direction','extra.creativeCopy':'5 năm kinh nghiệm thiết kế Canva · 4 năm kinh nghiệm dựng video CapCut · Thiết kế thuyết trình · Truyền thông thị giác · Biên tập video','contact.eyebrow':'Let’s talk','contact.heading':'Waiiiii...t, bạn có một bài toán gì đó','contact.headingAccent':'cần tối ưu đúng khôngg?','contact.intro':'Chính xác! Bên này chúng tôi khá đau đầu mấy cái tác vụ lặp đi lặp lại và cần một ai đó giúp được việc này...','contact.flow':'Marketing Problem → Research / Data → Process Design → AI / Automation → Workflow / System → Measurement','form.name':'Tên của bạn','form.email':'Email','form.message':'Bài toán cần tối ưu','form.submit':'Gửi cho tôi','form.namePlaceholder':'Nguyễn Văn A','form.messagePlaceholder':'Bạn đang gặp bài toán Marketing / Data / Automation nào?','form.subject':'Tin nhắn mới từ hoangquocviet.id.vn','modal.evidence':'Proof','modal.openTab':'Mở tab mới','modal.download':'Tải','modal.close':'Đóng','modal.what':'Điều project thể hiện','proof.pdf':'Mở báo cáo','proof.image':'Xem hình','proof.gallery':'Xem gallery','proof.link':'Mở liên kết','proof.download':'Tải tài liệu'},en:{'nav.projects':'Projects','nav.insights':'Insights','nav.skills':'Capabilities','nav.experience':'Experience','nav.contact':'Contact','nav.cta':'Message me','hero.projects':'View projects','hero.contact':'Discuss a problem','status':'Open to new opportunities','approach.eyebrow':'How I think about the work','approach.resultTitle':'Marketing Operations','approach.lead':'I focus on how technology turns a Marketing problem into an operating process that can be measured, standardized and improved continuously.','formula.marketing':'Marketing','formula.marketingMicro':'understand people and the story behind the numbers','formula.data':'Data','formula.dataMicro':'test assumptions against real data','formula.ai':'AI','formula.aiMicro':'accelerate analysis, creation and processing','formula.auto':'Automation','formula.autoMicro':'make repeatable work run consistently and structurally','formula.result':'Marketing Operations — executable · measurable · optimizable','process.kicker':'Working loop','process.1':'Marketing Problem','process.2':'Research / Data','process.3':'Process Design','process.4':'AI / Automation','process.5':'Workflow / System','process.6':'Structured Output → Decision → Measurement','projects.eyebrow':'Selected work','projects.heading':'Problems I have','projects.headingAccent':'tried to build and test.','projects.lead':'From automation and AI systems to research, creative production and Marketing strategy — each project turns a problem into something visible, measurable and explainable.','project.open':'Open case study','insights.eyebrow':'Insights','insights.heading':'MarTech & AI','insights.headingAccent':'deep dives.','insights.lead':'Analysis, technical breakdowns and research notes about the systems behind modern Marketing.','skills.eyebrow':'The toolkit','skills.heading':'Tools I','skills.headingAccent':'have actually used.','skills.lead':'Not a checklist for completeness. These are four capability clusters at the intersection of Marketing, Data, AI, Automation and Technology.','experience.eyebrow':'Experience & Certifications','experience.heading':'Where I bring that thinking into','experience.headingAccent':'practice.','experience.copy':'Coordinating design and video teams, trend analysis and multi-channel communication execution — from ideas, content and visuals to getting campaigns shipped.','experience.roleProof':'Communications role','exp.communication':'Communication','exp.design':'Design','exp.video':'Video','exp.trends':'Trends & Analysis','exp.campaign':'Campaign Execution','exp.coordination':'Coordination','cert.anthropic':'Anthropic','cert.marketing':'Marketing & Analytics','cert.english':'English','extra.creative':'Creative','extra.direction':'Working direction','extra.creativeCopy':'Canva ~5 years · CapCut ~4 years · Presentation design · Visual communication · Video editing','contact.eyebrow':'Let’s talk','contact.heading':'Have a Marketing problem that needs','contact.headingAccent':'optimizing?','contact.intro':'I work across Marketing Operations, MarTech, Marketing Automation, CRM Operations, Marketing Analytics, Growth Operations and AI-enabled Marketing.','contact.flow':'Marketing Problem → Research / Data → Process Design → AI / Automation → Workflow / System → Measurement','form.name':'Your name','form.email':'Email','form.message':'What problem needs optimizing?','form.submit':'Send to me','form.namePlaceholder':'Alex Nguyen','form.messagePlaceholder':'What Marketing / Data / Automation problem are you working on?','form.subject':'New message from hoangquocviet.id.vn','modal.evidence':'Proof','modal.openTab':'Open in new tab','modal.download':'Download','modal.close':'Close','modal.what':'What it demonstrates','proof.pdf':'Open report','proof.image':'View image','proof.gallery':'View gallery','proof.link':'Open link','proof.download':'Download file'}};
const PROJECTS=[
  {id:'lead-intent',index:'01',tone:['#ff6b35','#ff2d87'],visual:'workflow',content:{vi:{category:['Marketing','AI','Automation','Data'],title:'AI-Powered Lead Intent Automation',hook:'Căn bản thì, đây là luồng n8n tự động săn tìm tín hiệu nhu cầu ẩn trên mạng xã hội, lọc bỏ rác, phân loại ý định mua bằng AI và route lead nóng về Telegram (hoặc ứng dụng khác) về cho team Sale xử lý!.',stats:[['n8n','workflow'],['LLM','intent routing'],['JSON','structured output']],intro:'Một hệ thống thử nghiệm biến thông tin online phân mảnh thành tín hiệu nhu cầu có cấu trúc và có thể hành động.',story:[['Bài toán','Phần tốn công không chỉ là tìm thông tin mà là nhận ra đâu là tín hiệu nhu cầu thật, rồi đưa tín hiệu đó về cùng một format để xử lý.'],['Luồng xử lý','Data Source → Data Extraction → AI Processing → Intent Classification → Structured JSON → Lead Signal → Automated Notification.'],['Dữ liệu đầu ra','Author name, source domain, required service, pain point, contact information, source URL, suggested approach và confidence score.'],['Công nghệ','n8n · LLM routing · API / Webhook · JSON · HTTP · Conditional processing · Data transformation · PostgreSQL · Telegram notification · Workflow monitoring.'],['Ứng dụng Marketing','Lead discovery · Lead qualification · Intent detection · Demand signal monitoring · Information standardization · Automated routing · Faster response workflows.']]},en:{category:['Marketing','AI','Automation','Data'],title:'AI-Powered Lead Intent Automation',hook:'An n8n workflow that detects demand signals, structures the information and routes useful lead signals into an actionable format.',stats:[['n8n','workflow'],['LLM','intent routing'],['JSON','structured output']],intro:'An experiment that turns fragmented online information into structured, actionable demand signals.',story:[['Problem','The difficult part is not only finding information, but recognizing which signals show real demand and moving them into a consistent format.'],['Flow','Data Source → Data Extraction → AI Processing → Intent Classification → Structured JSON → Lead Signal → Automated Notification.'],['Output','Author name, source domain, required service, pain point, contact information, source URL, suggested approach and confidence score.'],['Technology','n8n · LLM routing · API / Webhook · JSON · HTTP · Conditional processing · Data transformation · PostgreSQL · Telegram notification · Workflow monitoring.'],['Marketing use','Lead discovery · Lead qualification · Intent detection · Demand signal monitoring · Information standardization · Automated routing · Faster response workflows.']]}},proof:[]},
  {id:'shopping-research',index:'02',tone:['#22d3ee','#5b7cfa'],visual:'research',content:{vi:{category:['Marketing','Data','Research'],title:'Consumer Online Shopping Behavior Research',hook:'Khảo sát định lượng và phân tích thống kê (SPSS/AMOS) trên 145+ mẫu dữ liệu người tiêu dùng Hà Nội để bóc trần các yếu tố tâm lý và nhân khẩu học chi phối hành vi mua sắm trực tuyến.',stats:[['193','valid responses'],['0.849','KMO'],['68.7%','variance'],['0.694','R²'],['0.679','adjusted R²']],intro:'Đề tài NCKH cấp trường 2025–2026 về mối quan hệ giữa các yếu tố tâm lý, nhân khẩu học và hành vi mua sắm trực tuyến của người tiêu dùng tại Hà Nội.',story:[['Phương pháp','Mixed-method research · Quantitative survey · SPSS / AMOS · Cronbach’s Alpha · Exploratory Factor Analysis · Multiple regression · Interaction analysis · Extended UTAUT.'],['Kết quả chính','KMO 0.849 · Explained variance 68.7% · R² 0.694 · Adjusted R² 0.679 · 4/7 giả thuyết được chấp nhận gồm H2, H4, H6, H7.'],['Ứng dụng Marketing','Phát triển khuyến nghị về phân khúc và personalized marketing dựa trên đặc điểm nhân khẩu học và tâm lý người tiêu dùng.'],['Điều project thể hiện','Consumer Research → Data Analysis → Statistical Validation → Marketing Insight → Business Recommendation.']]},en:{category:['Marketing','Data','Research'],title:'Consumer Online Shopping Behavior Research',hook:'A Hanoi online-shopping behavior study using quantitative survey data, SPSS / AMOS and an Extended UTAUT framework.',stats:[['193','valid responses'],['0.849','KMO'],['68.7%','variance'],['0.694','R²'],['0.679','adjusted R²']],intro:'A university research project from 2025–2026 examining relationships between psychological and demographic factors and online-shopping behavior in Hanoi.',story:[['Method','Mixed-method research · Quantitative survey · SPSS / AMOS · Cronbach’s Alpha · Exploratory Factor Analysis · Multiple regression · Interaction analysis · Extended UTAUT.'],['Selected results','KMO 0.849 · Explained variance 68.7% · R² 0.694 · Adjusted R² 0.679 · 4/7 hypotheses accepted: H2, H4, H6, H7.'],['Marketing application','Developed recommendations around segmentation and personalized marketing based on demographic and psychological characteristics.'],['What it demonstrates','Consumer Research → Data Analysis → Statistical Validation → Marketing Insight → Business Recommendation.']]}},proof:[]},
  {id:'ai-learning',index:'03',tone:['#a78bfa','#22d3ee'],visual:'research2',content:{vi:{category:['AI','Research','Education'],title:'AI & Learning Performance Research',hook:'Nghiên cứu và triển khai giải pháp ép AI làm trợ lý học tập: giúp sinh viên tối ưu thời gian nghiên cứu, tự động hóa việc tóm tắt tài liệu và nâng cao năng suất xử lý công việc hằng ngày.',stats:[['ĐTTĐ2425-20','project code'],['20M','VND budget'],['04/2025','start'],['03/2026','end']],intro:'Đề tài cấp trường 2024–2025 tập trung vào mối liên hệ giữa Artificial Intelligence, Education và Student Productivity.',story:[['Bối cảnh','University-level research project do Khoa Quản trị Kinh doanh chủ trì. Vai trò: Research team member.'],['Thông tin dự án','Thời gian 04/2025–03/2026 · Mã đề tài ĐTTĐ2425-20 · Ngân sách được duyệt 20.000.000 VNĐ.'],['Trọng tâm','Artificial Intelligence → Education → Student Productivity → Applied Research.'],['Điều project thể hiện','Khả năng chuyển một câu hỏi về công nghệ thành một bài toán nghiên cứu có cấu trúc và hướng ứng dụng.']]},en:{category:['AI','Research','Education'],title:'AI & Learning Performance Research',hook:'A university research project on applying AI to improve student learning performance at UTT.',stats:[['ĐTTĐ2425-20','project code'],['20M','VND budget'],['04/2025','start'],['03/2026','end']],intro:'A university research project focused on the relationship between Artificial Intelligence, Education and Student Productivity.',story:[['Context','A university-level research project hosted by the Faculty of Business Faculty. Role: Research team member.'],['Project facts','Duration 04/2025–03/2026 · Project code ĐTTĐ2425-20 · Approved budget 20,000,000 VND.'],['Focus','Artificial Intelligence → Education → Student Productivity → Applied Research.'],['What it demonstrates','Turning a technology question into a structured research problem with an applied direction.']]}},proof:[]},
  {id:'utt-ai-design',index:'04',tone:['#a78bfa','#ff6b35'],visual:'design',content:{vi:{category:['Creative','AI','Technology'],title:'UTT AI Design Network',hook:'Xây dựng hệ thống lai ghép (LoRA & ControlNet Canny) trên nền tảng Stable Diffusion XL, tự động hóa quy trình thiết kế ấn phẩm truyền thông tuân thủ tuyệt đối bộ nhận diện thương hiệu UTT, tối ưu tốc độ render và loại bỏ thao tác thủ công.',stats:[['76','images'],['~80%','structure preserved'],['~5s','per image'],['V1','LoRA model']],intro:'Một AI-assisted creative production system được thiết kế để hỗ trợ poster, banner, backdrop, promotional visuals và event decoration concepts theo visual identity của UTT.',story:[['Hệ thống','Stable Diffusion XL · Automatic1111 · LoRA fine-tuning · ControlNet · Canny Edge Detection · Prompt Engineering · Dataset Construction · Auto-captioning.'],['Dataset & model','76 hình ảnh từ hệ thống nhận diện UTT được dùng để fine-tune domain-specific LoRA model UTT_Design_Net_V1.'],['Kết quả thử nghiệm','LoRA + ControlNet giúp tăng tính nhất quán của màu sắc, logo và cấu trúc kiến trúc; testing báo cáo khoảng 80% structural preservation và khoảng 5 giây / ảnh ở cấu hình chuẩn.'],['Standardization','Workflow được đóng gói thành preset có thể tái sử dụng để người dùng không phải cấu hình lại toàn bộ technical pipeline mỗi lần.']]},en:{category:['Creative','AI','Technology'],title:'UTT AI Design Network',hook:'An AI system that supports visual production in UTT’s identity instead of rebuilding the process from scratch for each asset.',stats:[['76','images'],['~80%','structure preserved'],['~5s','per image'],['V1','LoRA model']],intro:'An AI-assisted creative production system designed for posters, banners, backdrops, promotional visuals and event decoration concepts within UTT’s visual identity.',story:[['System','Stable Diffusion XL · Automatic1111 · LoRA fine-tuning · ControlNet · Canny Edge Detection · Prompt Engineering · Dataset Construction · Auto-captioning.'],['Dataset & model','76 images from UTT’s visual identity system were used to fine-tune the domain-specific LoRA model UTT_Design_Net_V1.'],['Tested result','LoRA + ControlNet improved consistency of colors, logos and architectural structures; testing reported about 80% structural preservation and about 5 seconds per image in the standard configuration.'],['Standardization','The workflow was packaged as a reusable preset so users do not need to reconfigure the full technical pipeline each time.']]}},proof:[]},
  {id:'chicken-plus',index:'05',tone:['#ff6b35','#d4a017'],visual:'journey',content:{vi:{category:['Marketing Strategy','Consumer Insight','Communication'],title:'Chicken Plus Marketing Journey',hook:'Giải pháp chiến lược định vị lại thương hiệu Chicken Plus (Chùa Láng): Nghiên cứu dữ liệu sơ cấp, định hình chân dung khách hàng, bóc tách insight và triển khai khung ý tưởng sáng tạo (Ideation) cho vòng 2 cuộc thi Marketing Journey.',stats:[],intro:'Project Marketing Journey competition phát triển xoay quanh brand Chicken Plus, đi từ nghiên cứu thị trường tới chiến lược và truyền thông.',story:[['Cấu trúc','Market Context → Customer Profile → Consumer Insight → Communication Objective → Key Communication → Creative Idea → Communication Channels → Media Direction.'],['Phần đã thực hiện','Market analysis · Customer profiling · Consumer insight · Communication objectives · Key messaging · Creative concept · Communication channel planning · Media direction.'],['Điều project thể hiện','Marketing Research → Insight → Strategy → Creative → Communication Execution.']]},en:{category:['Marketing Strategy','Consumer Insight','Communication'],title:'Chicken Plus Marketing Journey',hook:'From market context to consumer insight, creative idea and communication direction — a Marketing project that follows the full journey.',stats:[],intro:'A Marketing Journey competition project developed around the Chicken Plus brand, moving from market analysis into strategy and communication.',story:[['Structure','Market Context → Customer Profile → Consumer Insight → Communication Objective → Key Communication → Creative Idea → Communication Channels → Media Direction.'],['What I worked on','Market analysis · Customer profiling · Consumer insight · Communication objectives · Key messaging · Creative concept · Communication channel planning · Media direction.'],['What it demonstrates','Marketing Research → Insight → Strategy → Creative → Communication Execution.']]}},proof:[]},
  {id:'ai-websites',index:'06',tone:['#5b7cfa','#22d3ee'],visual:'web',content:{vi:{category:['MarTech','AI','Technology','Product Thinking'],title:'Website & AI-assisted Digital Projects',hook:'Bất ngờ chưa? Trang web mượt mà bạn đang lướt nãy giờ không phải là một mẫu thiết kế có sẵn, mà chính là cái project thực tế được dựng lên bằng AI-assisted development và tư duy sản phẩm đấy.',stats:[['Claude Code','development'],['MCP','context'],['GitHub','versioning'],['UI/UX','prototype']],intro:'Các thử nghiệm website và digital product nhỏ sử dụng AI-assisted development thay vì chỉ dựa vào hand-coding truyền thống.',story:[['Phạm vi','AI-assisted website development · AI agents · API integration · Git / GitHub · VS Code · Claude Code · GitHub Copilot · MCP.'],['Cách làm','Rapid prototyping · Basic UI/UX · Workflow-oriented development · Structured iteration.'],['Định hướng','Không tập trung trở thành software engineer thuần túy, mà dùng technology để xây và cải thiện Marketing-related processes và digital solutions.']]},en:{category:['MarTech','AI','Technology','Product Thinking'],title:'Website & AI-assisted Digital Projects',hook:'Using AI-assisted development to build websites and digital prototypes faster while practicing a product-oriented way of thinking.',stats:[['Claude Code','development'],['MCP','context'],['GitHub','versioning'],['UI/UX','prototype']],intro:'Small website and digital-product experiments built with AI-assisted development rather than relying only on traditional hand-coding.',story:[['Scope','AI-assisted website development · AI agents · API integration · Git / GitHub · VS Code · Claude Code · GitHub Copilot · MCP.'],['Approach','Rapid prototyping · Basic UI/UX · Workflow-oriented development · Structured iteration.'],['Direction','The goal is not to become a pure software engineer, but to use technology to build and improve Marketing-related processes and digital solutions.']]}},proof:[]}
];

const SKILLS=[
  {num:'01',accent:'#c8f000',content:{vi:{title:'AI & Automation Pipeline',copy:'Xây workflow có thể nhận dữ liệu, xử lý, rẽ nhánh, chuẩn hóa và route đầu ra.',items:['n8n','AI Workflow Automation','Webhooks','API Integration','JSON Transformation','AI Agents','Telegram Routing']},en:{title:'AI & Automation Pipeline',copy:'Build workflows that receive, process, branch, structure and route information into useful outputs.',items:['n8n','AI Workflow Automation','Webhooks','API Integration','JSON Transformation','AI Agents','Telegram Routing']}}},
  {num:'02',accent:'#22d3ee',content:{vi:{title:'Data & Statistical Research',copy:'Đi từ survey và dữ liệu định lượng đến kiểm định mô hình và insight Marketing.',items:['SPSS','AMOS','Quantitative Research','EFA','Cronbach’s Alpha','Multiple Regression','Excel Advanced']},en:{title:'Data & Statistical Research',copy:'Move from survey data and quantitative analysis to model testing and Marketing insight.',items:['SPSS','AMOS','Quantitative Research','EFA','Cronbach’s Alpha','Multiple Regression','Excel Advanced']}}},
  {num:'03',accent:'#5b7cfa',content:{vi:{title:'MarTech & AI-assisted Dev',copy:'Dùng coding assistant và developer tools để biến ý tưởng thành prototype và hệ thống có cấu trúc.',items:['Claude Code','Model Context Protocol','Git / GitHub','GitHub Copilot','VS Code','Prototyping','AI-assisted Development']},en:{title:'MarTech & AI-assisted Dev',copy:'Use coding assistants and developer tools to turn ideas into structured prototypes and digital systems.',items:['Claude Code','Model Context Protocol','Git / GitHub','GitHub Copilot','VS Code','Prototyping','AI-assisted Development']}}},
  {num:'04',accent:'#ff6b35',content:{vi:{title:'Marketing Strategy & Creative',copy:'Giữ nền tảng Marketing để công nghệ luôn quay về bài toán người dùng, funnel và hiệu quả.',items:['Consumer Behavior','Customer Journey','Marketing Funnel','CRO','Canva · ~5 years','CapCut · ~4 years','Communication Strategy']},en:{title:'Marketing Strategy & Creative',copy:'Keep Marketing fundamentals at the center so technology always returns to people, funnels and outcomes.',items:['Consumer Behavior','Customer Journey','Marketing Funnel','CRO','Canva · ~5 years','CapCut · ~4 years','Communication Strategy']}}}
];

const INSIGHT_SEED_SOURCE=[
  {id:'gemini-4-argon',tone:['#22d3ee','#a78bfa'],category:['AI','MarTech','Analysis'],title:'Gemini 4 Argon: signal, hype and the operator view',hook:'Một bài phân tích về cách đọc một làn sóng AI mới: tách năng lực thật khỏi hiệu ứng truyền thông, rồi chọn công cụ dựa trên workflow và bài toán vận hành.',intro:'Deep-dive editorial về AI, MarTech và cách một Marketing Operator nên đánh giá công nghệ trước khi đưa nó vào hệ thống.',story:[['The question','Không phải model nào đang được nhắc đến nhiều nhất, mà model nào giải quyết được một bước cụ thể trong workflow.'],['Operator lens','Đánh giá theo context, reliability, structured output, integration cost và khả năng đo lường sau triển khai.'],['Takeaway','Claude Code và MCP vẫn có giá trị khi mục tiêu là xây context-aware systems thay vì chỉ chạy theo benchmark.']]}
];

const certAssets=new Map();

const INSIGHT_FALLBACK=INSIGHT_SEED_SOURCE.map((source,index)=>({
  kind:'insight',id:source.id,dbId:null,index:String(index+1).padStart(2,'0'),tone:[...source.tone],visual:'web',published:true,readMinutes:1,publishedAt:null,
  content:{
    vi:{category:[...source.category],title:source.title,hook:source.hook,intro:source.intro,stats:[],story:source.story.map(([title,body])=>[title,body])},
    en:{category:[...source.category],title:source.title,hook:'An analysis of how to read a new AI wave: separate real capability from media hype, then choose tools by workflow and operating problem.',intro:'An editorial deep dive into AI, MarTech and how a Marketing Operator should evaluate technology before putting it into a system.',stats:[],story:[['The right question','It is not which model gets the most attention, but which model solves a concrete step in a workflow.'],['The operator lens','Evaluate context, reliability, structured output, integration cost and the ability to measure after deployment.'],['Takeaway','Claude Code and MCP remain valuable when the goal is to build context-aware systems instead of simply chasing benchmarks.']]}
  },
  sections:source.story.map(([title,body],sectionIndex)=>({id:`gemini-4-argon-${sectionIndex+1}`,sort_order:sectionIndex,title_vi:title,body_vi:body,title_en:title,body_en:[
    'It is not which model gets the most attention, but which model solves a concrete step in a workflow.',
    'Evaluate context, reliability, structured output, integration cost and the ability to measure after deployment.',
    'Claude Code and MCP remain valuable when the goal is to build context-aware systems instead of simply chasing benchmarks.'
  ][sectionIndex],blocks:{version:1,items:[{id:`gemini-4-argon-${sectionIndex+1}-paragraph`,type:'paragraph',content:{text_vi:body,text_en:[
    'It is not which model gets the most attention, but which model solves a concrete step in a workflow.',
    'Evaluate context, reliability, structured output, integration cost and the ability to measure after deployment.',
    'Claude Code and MCP remain valuable when the goal is to build context-aware systems instead of simply chasing benchmarks.'
  ][sectionIndex]},settings:{}}]}})),proof:[]}));
const INSIGHTS=[];
INSIGHTS.push(...deepClone(INSIGHT_FALLBACK));

const CERTS={anthropic:['Claude 101','Claude Code 101','Claude Code in Action','Introduction to Model Context Protocol','Model Context Protocol: Advanced Topics'],marketing:['Google Analytics / GA4 Certification','HubSpot Inbound Certification'],english:['TOEIC Speaking & Writing — 260 (Speaking 110 · Writing 150)']};
Object.assign(I18N.vi,{'cert.issuer':'Đơn vị cấp','cert.date':'Ngày cấp','cert.verify':'Xác minh chứng chỉ','cert.description':'Mô tả','cert.evidence':'Minh chứng','cert.noEvidence':'Chưa có minh chứng','cert.openEvidence':'Mở minh chứng'});
Object.assign(I18N.en,{'cert.issuer':'Issuer','cert.date':'Issue date','cert.verify':'Verify credential','cert.description':'Description','cert.evidence':'Evidence','cert.noEvidence':'No evidence uploaded','cert.openEvidence':'Open evidence'});
Object.assign(I18N.vi,{'insights.readMinutes':'{n} phút đọc','insights.read':'Đọc bài phân tích','insights.empty':'Chưa có bài viết','insights.cover':'Ảnh bìa Insight'});
Object.assign(I18N.en,{'insights.readMinutes':'{n} min read','insights.read':'Read the analysis','insights.empty':'No articles yet','insights.cover':'Insight cover'});

const CERT_GROUP_DEFAULTS=[
  {id:'communications',title:{vi:'Vai trò Truyền thông',en:'Communications role'},legacyKeys:['communications','experience'],items:[{id:'exp-vice-head-comms',title:{vi:'Phó chủ nhiệm truyền thông',en:'Vice Head of Communications'},issuer:'UMC — UTT MC & Events Club',date:'',credentialUrl:'',description:{vi:'Điều phối nội dung, thiết kế, video, phân tích xu hướng và triển khai truyền thông đa kênh.',en:'Coordinated content, design, video, trend analysis, and multi-channel communications execution.'},legacyTitles:['Phó chủ nhiệm truyền thông','Vice Head of Communications']}]},
  {id:'anthropic',title:{vi:'Anthropic',en:'Anthropic'},legacyKeys:['anthropic'],items:[
    {id:'anthropic-claude-101',title:{vi:'Claude 101',en:'Claude 101'},issuer:'Anthropic',date:'',credentialUrl:'',description:{vi:'',en:''},legacyTitles:['Claude 101']},
    {id:'anthropic-claude-code-101',title:{vi:'Claude Code 101',en:'Claude Code 101'},issuer:'Anthropic',date:'',credentialUrl:'',description:{vi:'',en:''},legacyTitles:['Claude Code 101']},
    {id:'anthropic-claude-code-in-action',title:{vi:'Claude Code in Action',en:'Claude Code in Action'},issuer:'Anthropic',date:'',credentialUrl:'',description:{vi:'',en:''},legacyTitles:['Claude Code in Action']},
    {id:'anthropic-mcp-intro',title:{vi:'Introduction to Model Context Protocol',en:'Introduction to Model Context Protocol'},issuer:'Anthropic',date:'',credentialUrl:'',description:{vi:'',en:''},legacyTitles:['Introduction to Model Context Protocol']},
    {id:'anthropic-mcp-advanced',title:{vi:'Model Context Protocol: Advanced Topics',en:'Model Context Protocol: Advanced Topics'},issuer:'Anthropic',date:'',credentialUrl:'',description:{vi:'',en:''},legacyTitles:['Model Context Protocol: Advanced Topics']}
  ]},
  {id:'marketing-analytics',title:{vi:'Marketing & Analytics',en:'Marketing & Analytics'},legacyKeys:['marketing','marketing-analytics'],items:[
    {id:'google-ga4',title:{vi:'Google Analytics / GA4 Certification',en:'Google Analytics / GA4 Certification'},issuer:'Google',date:'',credentialUrl:'',description:{vi:'',en:''},legacyTitles:['Google Analytics / GA4 Certification']},
    {id:'hubspot-inbound',title:{vi:'HubSpot Inbound Certification',en:'HubSpot Inbound Certification'},issuer:'HubSpot',date:'',credentialUrl:'',description:{vi:'',en:''},legacyTitles:['HubSpot Inbound Certification']}
  ]},
  {id:'english',title:{vi:'Tiếng Anh',en:'English'},legacyKeys:['english'],items:[{id:'toeic-sw-260',title:{vi:'TOEIC Speaking & Writing — 260 (Speaking 110 · Writing 150)',en:'TOEIC Speaking & Writing — 260 (Speaking 110 · Writing 150)'},issuer:'ETS',date:'',credentialUrl:'',description:{vi:'',en:''},legacyTitles:['TOEIC Speaking & Writing — 260 (Speaking 110 · Writing 150)']}]}
];

function certMatchText(value){return String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function certLocalized(value,fallback={vi:'',en:''}){
  if(value&&typeof value==='object'&&!Array.isArray(value))return {vi:String(value.vi??fallback.vi??''),en:String(value.en??fallback.en??'')};
  if(typeof value==='string')return {vi:value,en:value};
  return {vi:String(fallback.vi||''),en:String(fallback.en||'')};
}
function normalizeCertGroups(raw){
  const legacy=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
  const groups=Array.isArray(raw)?raw:[];
  const sourceFor=definition=>groups.find(group=>group?.id===definition.id)||definition.legacyKeys.map(key=>legacy[key]).find(Boolean)||null;
  const itemsFor=group=>{
    if(Array.isArray(group?.items))return group.items;
    const items=group?.items&&typeof group.items==='object'?group.items:{};
    const vi=certItemList(items.vi),en=certItemList(items.en),length=Math.max(vi.length,en.length);
    return Array.from({length},(_,index)=>({title:{vi:vi[index]||en[index]||'',en:en[index]||vi[index]||''}}));
  };
  return CERT_GROUP_DEFAULTS.map(definition=>{
    const source=sourceFor(definition),sourceItems=itemsFor(source),groupTitle=certLocalized(source?.title||source?.label,definition.title),removedIds=new Set(Array.isArray(source?.removedIds)?source.removedIds.map(String):[]),usedItems=new Set();
    const items=definition.items.filter(defaultItem=>!removedIds.has(defaultItem.id)).map(defaultItem=>{
      const match=sourceItems.find(candidate=>{
        if(usedItems.has(candidate))return false;
        if(candidate?.id===defaultItem.id)return true;
        const title=candidate?.title||{vi:candidate?.title_vi||candidate?.vi||candidate,en:candidate?.title_en||candidate?.en||candidate};
        const candidates=[title.vi,title.en];
        return candidates.some(value=>defaultItem.legacyTitles.some(known=>certMatchText(value)===certMatchText(known)));
      });
      if(!match)return {...defaultItem,title:{...defaultItem.title},description:{...defaultItem.description}};
      usedItems.add(match);
      const title=match.title||{vi:match.title_vi||match.vi||'',en:match.title_en||match.en||''};
      const description=match.description||{vi:match.description_vi||'',en:match.description_en||''};
      return {...defaultItem,title:certLocalized(title,defaultItem.title),issuer:String(match.issuer??defaultItem.issuer),date:String(match.date??defaultItem.date),credentialUrl:String(match.credentialUrl??match.credential_url??defaultItem.credentialUrl),description:certLocalized(description,defaultItem.description)};
    });
    sourceItems.forEach((candidate,index)=>{
      if(usedItems.has(candidate))return;
      const item=candidate&&typeof candidate==='object'?candidate:{title:{vi:String(candidate||''),en:String(candidate||'')}};
      const id=String(item.id||`custom-${definition.id}-${index+1}`);
      if(removedIds.has(id))return;
      const rawTitle=item.title||{vi:item.title_vi||item.vi||'',en:item.title_en||item.en||''},rawDescription=item.description||{vi:item.description_vi||'',en:item.description_en||''};
      items.push({...item,id,title:certLocalized(rawTitle),issuer:String(item.issuer||''),date:String(item.date||''),credentialUrl:String(item.credentialUrl||item.credential_url||''),description:certLocalized(rawDescription)});
    });
    return {id:definition.id,title:groupTitle,items,removedIds:[...removedIds]};
  });
}

function certificateItemById(id,groups=normalizeCertGroups(getGlobalContent().experience.certGroups)){
  for(const group of groups)for(const item of group.items)if(item.id===id)return item;
  return null;
}

function certificateOwnerType(id){return id==='exp-vice-head-comms'?'experience':'certificate'}

function certificateAssets(id){return [...(certAssets.get(id)||[])].sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0)||String(a.created_at||'').localeCompare(String(b.created_at||'')))}

function certCoverAsset(id){return certificateAssets(id).find(asset=>asset.asset_type==='cert_cover')||null}

function certAssetList(id){return certificateAssets(id).filter(asset=>asset.asset_type==='proof'||asset.asset_type==='gallery')}

const GLOBAL_SECTION_KEYS=['home','approach','projects','skills','experience','contact','footer'];

let globalPublishedContent=null;

let globalDbState='fallback';





function deepClone(v){return JSON.parse(JSON.stringify(v));}

function composeGlobalContent(...layers){const isObject=value=>value&&typeof value==='object'&&!Array.isArray(value);const merge=(target,source)=>{if(Array.isArray(source)){if(!Array.isArray(target))return deepClone(source);if(!source.length&&target.length)return deepClone(target);return source.map((value,index)=>{if(typeof value==='string'&&!value.trim()&&typeof target[index]==='string'&&target[index].trim())return target[index];return isObject(value)&&isObject(target[index])||Array.isArray(value)&&Array.isArray(target[index])?merge(target[index],value):deepClone(value)})}if(!isObject(source))return source;const out=isObject(target)?{...target}:{};for(const [key,value] of Object.entries(source)){if(typeof value==='string'&&!value.trim()&&typeof out[key]==='string'&&out[key].trim())continue;out[key]=isObject(value)||Array.isArray(value)?merge(out[key],value):value}return out};const content=layers.filter(layer=>layer!=null).reduce((result,layer)=>merge(result,layer),{});if(layers.some(layer=>Array.isArray(layer?.experience?.entries)&&layer.experience.entries.length===0&&(layer.experience.entriesManaged?.vi===true||layer.experience.entriesManaged?.en===true)))content.experience.entries=[];return content}

function legacyGlobalFallbackContent(){
  const mk=(vi,en)=>({vi,en});
  return {
    home:{name:mk('Hoàng Quốc Việt','Hoàng Quốc Việt'),role:mk('Marketing Operations · MarTech · AI-enabled Marketing','Marketing Operations · MarTech · AI-enabled Marketing'),description:mk('Xin chàooooo và chào mừng tất cả các bạn đã đến với trang web đầu tiên của mình :) Anyway, mình up portfolio, CV và hầu hết mọi thứ mà mình có lên đây. Định hướng của mình là trở thành một Marketing Operator, tức là giải quyết các bài toán kỹ thuật đằng sau marketing: từ tích hợp hệ thống, quản trị dữ liệu khách hàng cho đến tự động hóa toàn bộ những khâu lặp đi lặp lại mà con người không nên làm bằng tay ^^.','I optimize Marketing funnels and operations through data thinking, AI, workflow automation and hands-on execution.'),status:mk(I18N.vi.status,I18N.en.status),ctaProjects:mk(I18N.vi['hero.projects'],I18N.en['hero.projects']),ctaContact:mk(I18N.vi['hero.contact'],I18N.en['hero.contact']),ctaProjectsTarget:mk('#projects','#projects'),ctaContactTarget:mk('#contact','#contact'),nav:{projects:mk(I18N.vi['nav.projects'],I18N.en['nav.projects']),insights:mk(I18N.vi['nav.insights'],I18N.en['nav.insights']),skills:mk(I18N.vi['nav.skills'],I18N.en['nav.skills']),experience:mk(I18N.vi['nav.experience'],I18N.en['nav.experience']),contact:mk(I18N.vi['nav.contact'],I18N.en['nav.contact']),cta:mk(I18N.vi['nav.cta'],I18N.en['nav.cta'])}},
    approach:{eyebrow:mk(I18N.vi['approach.eyebrow'],I18N.en['approach.eyebrow']),resultTitle:mk(I18N.vi['approach.resultTitle'],I18N.en['approach.resultTitle']),lead:mk(I18N.vi['approach.lead'],I18N.en['approach.lead']),formula:[['marketing','formula.marketing','formula.marketingMicro'],['data','formula.data','formula.dataMicro'],['ai','formula.ai','formula.aiMicro'],['auto','formula.auto','formula.autoMicro']].map(x=>({label:mk(I18N.vi[x[1]],I18N.en[x[1]]),micro:mk(I18N.vi[x[2]],I18N.en[x[2]])})),result:mk(I18N.vi['formula.result'],I18N.en['formula.result']),processKicker:mk(I18N.vi['process.kicker'],I18N.en['process.kicker']),process:Array.from({length:6},(_,i)=>mk(I18N.vi[`process.${i+1}`],I18N.en[`process.${i+1}`]))},
    projects:{eyebrow:mk(I18N.vi['projects.eyebrow'],I18N.en['projects.eyebrow']),heading:mk(I18N.vi['projects.heading'],I18N.en['projects.heading']),headingAccent:mk(I18N.vi['projects.headingAccent'],I18N.en['projects.headingAccent']),lead:mk(I18N.vi['projects.lead'],I18N.en['projects.lead'])},
    skills:{eyebrow:mk(I18N.vi['skills.eyebrow'],I18N.en['skills.eyebrow']),heading:mk(I18N.vi['skills.heading'],I18N.en['skills.heading']),headingAccent:mk(I18N.vi['skills.headingAccent'],I18N.en['skills.headingAccent']),lead:mk(I18N.vi['skills.lead'],I18N.en['skills.lead']),cards:SKILLS.map(s=>({num:s.num,accent:s.accent,title:mk(s.content.vi.title,s.content.en.title),copy:mk(s.content.vi.copy,s.content.en.copy),items:mk(s.content.vi.items.join('\n'),s.content.en.items.join('\n'))}))},
    experience:{eyebrow:mk(I18N.vi['experience.eyebrow'],I18N.en['experience.eyebrow']),heading:mk(I18N.vi['experience.heading'],I18N.en['experience.heading']),headingAccent:mk(I18N.vi['experience.headingAccent'],I18N.en['experience.headingAccent']),lead:mk(I18N.vi['experience.copy'],I18N.en['experience.copy']),title:mk('UMC — UTT MC & Events Club','UMC — UTT MC & Events Club'),role:mk('Vice Head of Communications','Vice Head of Communications'),description:mk(I18N.vi['experience.copy'],I18N.en['experience.copy']),tags:{vi:[I18N.vi['exp.communication'],I18N.vi['exp.design'],I18N.vi['exp.video'],I18N.vi['exp.trends'],I18N.vi['exp.campaign'],I18N.vi['exp.coordination']],en:[I18N.en['exp.communication'],I18N.en['exp.design'],I18N.en['exp.video'],I18N.en['exp.trends'],I18N.en['exp.campaign'],I18N.en['exp.coordination']]},certGroups:{anthropic:{label:mk(I18N.vi['cert.anthropic'],I18N.en['cert.anthropic']),items:{vi:[...CERTS.anthropic],en:[...CERTS.anthropic]}},marketing:{label:mk(I18N.vi['cert.marketing'],I18N.en['cert.marketing']),items:{vi:[...CERTS.marketing],en:[...CERTS.marketing]}},english:{label:mk(I18N.vi['cert.english'],I18N.en['cert.english']),items:{vi:[...CERTS.english],en:[...CERTS.english]}}},creative:{label:mk(I18N.vi['extra.creative'],I18N.en['extra.creative']),text:mk(I18N.vi['extra.creativeCopy'],I18N.en['extra.creativeCopy'])},direction:{label:mk(I18N.vi['extra.direction'],I18N.en['extra.direction']),text:mk('Marketing Operations · MarTech · CRM Operations · Lifecycle Marketing · Growth Operations · AI-enabled Marketing','Marketing Operations · MarTech · CRM Operations · Lifecycle Marketing · Growth Operations · AI-enabled Marketing')}},
    contact:{eyebrow:mk(I18N.vi['contact.eyebrow'],I18N.en['contact.eyebrow']),heading:mk(I18N.vi['contact.heading'],I18N.en['contact.heading']),headingAccent:mk(I18N.vi['contact.headingAccent'],I18N.en['contact.headingAccent']),intro:mk(I18N.vi['contact.intro'],I18N.en['contact.intro']),flow:mk(I18N.vi['contact.flow'],I18N.en['contact.flow']),nameLabel:mk(I18N.vi['form.name'],I18N.en['form.name']),emailLabel:mk(I18N.vi['form.email'],I18N.en['form.email']),messageLabel:mk(I18N.vi['form.message'],I18N.en['form.message']),submit:mk(I18N.vi['form.submit'],I18N.en['form.submit']),namePlaceholder:mk(I18N.vi['form.namePlaceholder'],I18N.en['form.namePlaceholder']),messagePlaceholder:mk(I18N.vi['form.messagePlaceholder'],I18N.en['form.messagePlaceholder']),subject:mk(I18N.vi['form.subject'],I18N.en['form.subject'])},
    footer:{copyright:mk('© 2026 Hoàng Quốc Việt · hoangquocviet.id.vn','© 2026 Hoàng Quốc Việt · hoangquocviet.id.vn'),supporting:mk('Marketing Operations & Automation','Marketing Operations & Automation')}
  };
}

function globalFallbackContent(){
  const content=legacyGlobalFallbackContent();
  content.experience.entries=[];
  content.experience.entriesManaged={vi:false,en:false};
  content.experience.certGroups=normalizeCertGroups(content.experience.certGroups);
  return content;
}

function getLocalizedContent(value,lang=currentLang){
  const source=value&&typeof value==='object'&&!Array.isArray(value)?value:{};const requested=source[lang];const fallback=source[lang==='en'?'vi':'en'];
  const usable=v=>{if(v===undefined||v===null)return false;if(typeof v==='string')return v.trim()!=='';if(Array.isArray(v))return v.length>0;return typeof v!=='object';};
  if(usable(requested))return requested;
  if(usable(fallback))return fallback;
  return '';
}

function getGlobalContent(){const content=composeGlobalContent(globalFallbackContent(),globalPublishedContent||{});content.experience.certGroups=normalizeCertGroups(content.experience.certGroups);return content}

function getProfileContent(lang=currentLang){return getGlobalContent(lang).home||{};}

function parseContentJSON(value,fallback){try{const v=JSON.parse(String(value||''));return v&&typeof v==='object'?v:deepClone(fallback)}catch(_){return deepClone(fallback)}}

function isLocalizedLeafShape(shape){return !!(shape&&typeof shape==='object'&&!Array.isArray(shape)&&Object.prototype.hasOwnProperty.call(shape,'vi')&&Object.prototype.hasOwnProperty.call(shape,'en'));}

function legacyCertGroupsFromStored(viValue,enValue){
  const viSource=viValue&&typeof viValue==='object'&&!Array.isArray(viValue)?viValue:{};
  const enSource=enValue&&typeof enValue==='object'&&!Array.isArray(enValue)?enValue:{};
  const legacy={};
  CERT_GROUP_DEFAULTS.forEach(definition=>{
    const key=definition.legacyKeys.find(candidate=>viSource[candidate]||enSource[candidate]);
    if(!key)return;
    const viGroup=viSource[key]&&typeof viSource[key]==='object'?viSource[key]:{};
    const enGroup=enSource[key]&&typeof enSource[key]==='object'?enSource[key]:{};
    const viItems=viGroup.items&&typeof viGroup.items==='object'?certItemList(viGroup.items.vi):certItemList(viGroup.items);
    const enItems=enGroup.items&&typeof enGroup.items==='object'?certItemList(enGroup.items.en):certItemList(enGroup.items);
    legacy[key]={label:{vi:String(viGroup.label||definition.title.vi),en:String(enGroup.label||viGroup.label||definition.title.en)},items:{vi:viItems,en:enItems}};
  });
  return normalizeCertGroups(legacy);
}

function isCertificateGroupsShape(shape){return Array.isArray(shape)&&shape[0]?.id==='communications'}

function globalContentForStorage(node,lang,shape){
  if(isCertificateGroupsShape(shape))return normalizeCertGroups(node);
  if(Array.isArray(shape)&&shape.length===0)return deepClone(Array.isArray(node)?node:[]);
  if(isLocalizedLeafShape(shape)){
    const raw=node&&typeof node==='object'&&!Array.isArray(node)?node[lang]:undefined;
    return deepClone(raw===undefined||raw===null?'':raw);
  }
  if(Array.isArray(shape)){
    const arr=Array.isArray(node)?node:[];
    return shape.map((item,i)=>globalContentForStorage(arr[i],lang,item));
  }
  if(shape&&typeof shape==='object'){
    const src=node&&typeof node==='object'&&!Array.isArray(node)?node:{};
    const out={};Object.keys(shape).forEach(k=>{out[k]=globalContentForStorage(src[k],lang,shape[k])});return out;
  }
  return node===undefined||node===null?'':node;
}

function globalCanonicalFromStored(viValue,enValue,shape){
  if(isCertificateGroupsShape(shape)){
    const stored=[viValue,enValue].find(value=>Array.isArray(value)&&value.some(group=>typeof group?.id==='string'));
    return stored?normalizeCertGroups(stored):legacyCertGroupsFromStored(viValue,enValue);
  }
  if(isLocalizedLeafShape(shape)){
    const extract=(raw,lang)=>raw&&typeof raw==='object'&&!Array.isArray(raw)&&Object.prototype.hasOwnProperty.call(raw,'vi')&&Object.prototype.hasOwnProperty.call(raw,'en')?raw[lang]:raw;
    const vi=extract(viValue,'vi');const en=extract(enValue,'en');
    const legacyEn=(viValue&&typeof viValue==='object'&&!Array.isArray(viValue)&&Object.prototype.hasOwnProperty.call(viValue,'en'))?viValue.en:undefined;
    const legacyVi=(enValue&&typeof enValue==='object'&&!Array.isArray(enValue)&&Object.prototype.hasOwnProperty.call(enValue,'vi'))?enValue.vi:undefined;
    return {vi:vi===undefined||vi===null?'':vi,en:en===undefined||en===null?(legacyEn??legacyVi??''):en};
  }
  if(Array.isArray(shape)){
    if(shape[0]?.id==='communications'&&(!Array.isArray(viValue)||!Array.isArray(enValue)))return legacyCertGroupsFromStored(viValue,enValue);
    if(shape.length===0)return deepClone(Array.isArray(viValue)?viValue:Array.isArray(enValue)?enValue:[]);
    const va=Array.isArray(viValue)?viValue:[];const ea=Array.isArray(enValue)?enValue:[];
    return shape.map((item,i)=>globalCanonicalFromStored(va[i],ea[i],item));
  }
  if(shape&&typeof shape==='object'){
    const vo=viValue&&typeof viValue==='object'&&!Array.isArray(viValue)?viValue:{};const eo=enValue&&typeof enValue==='object'&&!Array.isArray(enValue)?enValue:{};
    const out={};const keys=new Set([...Object.keys(shape),...Object.keys(vo),...Object.keys(eo)]);keys.forEach(k=>{out[k]=globalCanonicalFromStored(vo[k],eo[k],shape[k]||{})});return out;
  }
  return {vi:viValue??'',en:enValue??''};
}

function globalPublicRowsPath(){return '/rest/v1/portfolio_content?select=content_key,value_vi,value_en,updated_at&content_key=like.global.published.%25&order=content_key.asc';}

async function fetchGlobalContentRows(){if(!sbReady())return [];const response=await sbFetch(globalPublicRowsPath(),{method:'GET'},null);const rows=await response.json();return Array.isArray(rows)?rows:[]}

function mergeStoredGlobalValue(fallback,value){if(Array.isArray(value))return deepClone(value);if(!value||typeof value!=='object')return value===undefined||value===null?deepClone(fallback):value;const out=fallback&&typeof fallback==='object'&&!Array.isArray(fallback)?deepClone(fallback):{};Object.keys(value).forEach(key=>{out[key]=mergeStoredGlobalValue(out[key],value[key])});return out}

function buildGlobalFromRows(rows,prefix){const fallback=globalFallbackContent(),out={};(rows||[]).filter(row=>String(row.content_key||'').startsWith(prefix)).forEach(row=>{const key=String(row.content_key).slice(prefix.length),sectionFallback=fallback[key]||{},fallbackVi=globalContentForStorage(sectionFallback,'vi',sectionFallback),fallbackEn=globalContentForStorage(sectionFallback,'en',sectionFallback),storedVi=mergeStoredGlobalValue(fallbackVi,parseContentJSON(row.value_vi,fallbackVi)),storedEn=mergeStoredGlobalValue(fallbackEn,parseContentJSON(row.value_en,fallbackEn)),canonical=globalCanonicalFromStored(storedVi,storedEn,sectionFallback);if(key==='skills'&&Array.isArray(canonical.cards))canonical.cards.forEach((card,index)=>{for(const field of ['num','accent']){const value=storedVi.cards?.[index]?.[field]??storedEn.cards?.[index]?.[field];if(value!==undefined)card[field]=value}});out[key]=canonical});return out}

function globalRowsToContent(rows,prefix){return buildGlobalFromRows(rows,prefix);}

async function loadGlobalPublished(){if(!sbReady()){globalPublishedContent=null;globalDbState='failed';HQVShared.emit('global');return false}try{const rows=await fetchGlobalContentRows(),publishedRows=rows.filter(row=>String(row.content_key||'').startsWith('global.published.')),fallback=globalFallbackContent();globalPublishedContent=publishedRows.length?buildGlobalFromRows(publishedRows,'global.published.'):null;globalDbState=publishedRows.length?'ready':'empty';HQVShared.emit('global');return true}catch(error){globalPublishedContent=null;globalDbState='failed';HQVShared.emit('global');return false}}

function getPath(obj,path){return path.split('.').reduce((cur,k)=>cur==null?undefined:cur[k],obj)}







function getWebStorage(name){try{return window[name]}catch(_){return null}}

function safeStorageGet(storage,key){try{return storage?.getItem(key)||null}catch(_){return null}}

function safeStorageSet(storage,key,value){try{storage?.setItem(key,String(value));return true}catch(_){return false}}

let currentLang=safeStorageGet(getWebStorage('localStorage'),'hqv-lang')==='en'?'en':'vi';

const $=s=>document.querySelector(s);

const $$=s=>Array.from(document.querySelectorAll(s));

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const t=k=>I18N[currentLang][k]??I18N.vi[k]??k;

const projectText=p=>p.content[currentLang];

const toneClass=name=>({Marketing:'warm','Marketing Strategy':'warm','Consumer Insight':'warm',Communication:'warm',AI:'violet',Automation:'lime',Data:'cyan',Research:'cyan',Creative:'violet',Technology:'blue',MarTech:'blue',Education:'violet','Product Thinking':'blue'})[name]||'lime';

const tag=name=>`<span class="pill ${toneClass(name)}">${esc(name)}</span>`;

const statsH=stats=>stats?.length?`<div class="stat-row">${stats.map(([v,l])=>`<div class="stat"><strong>${esc(v)}</strong><span>${esc(l)}</span></div>`).join('')}</div>`:'';

const dialogFocusReturn=new WeakMap();

function openModalDialog(dialog){if(!dialog)return;dialogFocusReturn.set(dialog,document.activeElement instanceof HTMLElement?document.activeElement:null);if(!dialog.open)dialog.showModal();requestAnimationFrame(()=>{const target=dialog.querySelector('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]');if(target)target.focus();});}

function closeModalDialog(dialog){if(!dialog)return;const target=dialogFocusReturn.get(dialog);if(dialog.open){dialog.querySelectorAll('video,audio').forEach(m=>{try{m.pause()}catch(_){}});dialog.close()}dialogFocusReturn.delete(dialog);requestAnimationFrame(()=>{if(target&&target.isConnected)target.focus();});}

function newId(){if(typeof crypto!=='undefined'&&typeof crypto.randomUUID==='function')return crypto.randomUUID();return 'id-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12)+'-'+Math.random().toString(36).slice(2,12)}

const BLOCKS_VERSION=1;

const BLOCK_TYPES=new Set(['heading','paragraph','richtext','quote','image','gallery','video','workflow','list','divider','proof','file','cta']);

function blockText(block,lang){
  const content=block?.content&&typeof block.content==='object'?block.content:{};
  return String(content[`text_${lang}`]??content[`body_${lang}`]??content.text??'');
}

function legacySplitParagraphs(text){
  return String(text||'').replace(/\r\n?/g,'\n').split(/\n[ \t]*\n+/).map(x=>x.trim()).filter(Boolean);
}

function legacyParagraphDocument(bodyVi='',bodyEn=''){
  const vi=String(bodyVi||''),en=String(bodyEn||'');
  if(!vi&&!en)return {version:BLOCKS_VERSION,items:[]};
  const pv=legacySplitParagraphs(vi),pe=legacySplitParagraphs(en);
  const aligned=pv.length&&pe.length?pv.length===pe.length:true;
  const count=Math.max(pv.length,pe.length);
  if(aligned&&count>1){
    return {version:BLOCKS_VERSION,items:Array.from({length:count},(_,i)=>({id:newId(),type:'paragraph',content:{text_vi:pv[i]||'',text_en:pe[i]||''},settings:{}}))};
  }
  return {version:BLOCKS_VERSION,items:[{id:newId(),type:'paragraph',content:{text_vi:vi,text_en:en},settings:{}}]};
}

function normalizeBlockDocument(value,bodyVi='',bodyEn=''){
  let doc=value;
  if(typeof doc==='string'){try{doc=JSON.parse(doc)}catch(_){doc=null}}
  if(!doc||typeof doc!=='object'||!Array.isArray(doc.items))return legacyParagraphDocument(bodyVi,bodyEn);
  const items=doc.items.map((raw,i)=>{
    const b=raw&&typeof raw==='object'?raw:{};
    const type=BLOCK_TYPES.has(b.type)?b.type:'paragraph';
    const content=b.content&&typeof b.content==='object'?b.content:{};
    const settings=b.settings&&typeof b.settings==='object'?b.settings:{};
    return {id:String(b.id||`${type}-${i+1}`),type,content,settings};
  });
  if(!items.length&&(bodyVi||bodyEn))return legacyParagraphDocument(bodyVi,bodyEn);
  return {version:Number(doc.version)||BLOCKS_VERSION,items};
}

function validateBlockDocument(value,bodyVi='',bodyEn=''){
  const doc=normalizeBlockDocument(value,bodyVi,bodyEn);
  if(doc.version!==BLOCKS_VERSION)throw new Error('unsupported_blocks_version');
  if(!Array.isArray(doc.items))throw new Error('invalid_blocks_items');
  doc.items.forEach((b,i)=>{if(!b.id||!BLOCK_TYPES.has(b.type)||!b.content||typeof b.content!=='object'||!b.settings||typeof b.settings!=='object')throw new Error(`invalid_block_${i}`)});
  return doc;
}

function blocksForSection(section){return validateBlockDocument(section?.blocks,section?.body_vi,section?.body_en)}

function blocksAreAuthored(raw){
  let doc=raw;
  if(typeof doc==='string'){try{doc=JSON.parse(doc)}catch(_){return false}}
  return !!doc&&typeof doc==='object'&&Array.isArray(doc.items)&&doc.items.length>0;
}

function sectionHasBlockStream(section){
  return !!section&&!section.__legacyBody&&blocksAreAuthored(section.blocks);
}

function safeLinkHref(value){
  const raw=String(value||'').trim();
  if(!raw)return '';
  try{
    const parsed=new URL(raw,window.location.href);
    const protocol=parsed.protocol.toLowerCase();
    return ['https:','http:','mailto:'].includes(protocol)?raw:'';
  }catch(_){return ''}
}

function sanitizeRichText(value){
  const allowedTags=new Set(['P','BR','STRONG','B','EM','I','U','H2','H3','UL','OL','LI','A','BLOCKQUOTE']);
  const html=String(value||'');
  if(!html)return '';
  if(typeof DOMParser==='undefined')return html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const doc=new DOMParser().parseFromString(`<div>${html}</div>`,'text/html');
  const root=doc.body.firstElementChild;
  const cleanNode=node=>{
    [...node.childNodes].forEach(child=>{
      if(child.nodeType===Node.TEXT_NODE)return;
      if(child.nodeType!==Node.ELEMENT_NODE){child.remove();return}
      const el=child;
      if(!allowedTags.has(el.tagName)){el.replaceWith(...[...el.childNodes]);return}
      [...el.attributes].forEach(attr=>{
        const name=attr.name.toLowerCase();
        if(name.startsWith('on')||name==='style'||name==='srcdoc'||name==='id'||name==='class')el.removeAttribute(attr.name);
      });
      if(el.tagName==='A'){
        const href=safeLinkHref(el.getAttribute('href'));
        if(!href){el.replaceWith(...[...el.childNodes]);return}
        el.setAttribute('href',href);
        el.setAttribute('target','_blank');
        el.setAttribute('rel','noopener noreferrer');
      }else{
        [...el.attributes].forEach(attr=>el.removeAttribute(attr.name));
      }
      cleanNode(el);
    });
  };
  cleanNode(root);
  return root.innerHTML.trim();
}

function richTextToPlainText(value){
  const html=sanitizeRichText(value);
  if(!html)return '';
  if(typeof DOMParser==='undefined')return html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const doc=new DOMParser().parseFromString(`<div>${html}</div>`,'text/html');
  return String(doc.body.textContent||'').replace(/\s+/g,' ').trim();
}

function safeEmbedUrl(value){
  const raw=String(value||'').trim();
  if(!raw)return '';
  try{
    const u=new URL(raw,window.location.href), host=u.hostname.toLowerCase();
    if(!['https:','http:'].includes(u.protocol))return '';
    const allowedHosts=new Set(['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com','youtu.be','www.youtu.be','vimeo.com','www.vimeo.com','player.vimeo.com']);
    return allowedHosts.has(host)?u.href:safeDirectVideoUrl(u.href);
  }catch(_){return ''}
}

function safeDirectVideoUrl(value){
  const raw=String(value||'').trim();
  if(!raw)return '';
  try{
    const url=new URL(raw);
    if(url.protocol!=='https:'||url.username||url.password)return '';
    return /\.(?:mp4|m4v|webm|ogv|ogg)$/i.test(url.pathname)?url.href:'';
  }catch(_){return ''}
}

function sanitizeBlockDocument(value){
  const doc=normalizeBlockDocument(value);
  doc.items=doc.items.map(block=>{
    const b={...block,content:{...(block.content||{})},settings:{...(block.settings||{})}};
    if(b.type==='richtext'){
      b.content.text_vi=sanitizeRichText(b.content.text_vi);
      b.content.text_en=sanitizeRichText(b.content.text_en);
    }
    if(b.type==='video'){
      const url=safeEmbedUrl(b.settings.url||'');
      b.settings.url=url;
    }
    return b;
  });
  return doc;
}

function getAsset(assetId){if(!assetId)return null;return assetRegistry.get(assetId)||null;}

function getAssets({projectId='',type=''}={}){
  let rows=[...assetRegistry.values()];
  if(type)rows=rows.filter(row=>String(row.asset_type||row.type||'')===String(type));
  if(projectId)rows.sort((a,b)=>{const keys=mediaProjectKeys(projectId);const ap=mediaAssetBelongsTo(a,keys)?0:1,bp=mediaAssetBelongsTo(b,keys)?0:1;if(ap!==bp)return ap-bp;return String(b.created_at||'').localeCompare(String(a.created_at||''));});
  return rows;
}

function listAssets(filters={}){return getAssets(filters)}

function searchAssets(query,filters={}){const q=String(query||'').trim().toLowerCase();return listAssets(filters).filter(row=>{if(!q)return true;return [row.original_name,row.file_name,row.title_vi,row.title_en,row.project_id,row.owner_id,row.owner_type].some(v=>String(v||'').toLowerCase().includes(q))})}

function getAssetUrl(asset){return asset?.storage_path?publicUrl(asset.storage_path):''}

function imageAssetsForProject(projectId){return getAssets({projectId}).filter(row=>String(row.mime_type||'').toLowerCase().startsWith('image/'));}

function imageAssetOptionLabel(row){return `${row.original_name||row.file_name||row.id} · ${row.asset_type||row.type||'image'}`;}

function certItemList(v){return Array.isArray(v)?v:typeof v==='string'?v.split(/\n+/).map(x=>x.trim()).filter(Boolean):[]}

function assetKindOf(row){const m=String(row?.mime_type||'').toLowerCase(),t0=String(row?.type||'').toLowerCase();if(m.startsWith('image/'))return 'image';if(m.startsWith('video/')||t0==='video')return 'video';if(m.startsWith('audio/')||t0==='audio')return 'audio';if(m==='application/pdf'||t0==='pdf')return 'pdf';if(m==='application/json'||t0==='json')return 'json';return 'file'}

function certBadgeHtml(item,lang){
  const title=getLocalizedContent(item.title,lang),issuer=String(item.issuer||''),cover=certCoverAsset(item.id);
  return `<button type="button" class="cert-badge" data-cert-open="${esc(item.id)}" aria-label="${esc(title)}${issuer?` · ${esc(issuer)}`:''}">${cover?`<img class="cert-badge-cover" src="${esc(getAssetUrl(cover))}" alt="${esc(title)}" loading="lazy">`:''}<strong>${esc(title)}</strong>${issuer?`<span>${esc(issuer)}</span>`:''}</button>`;
}

function certDetailHtml(item,lang=currentLang){
  if(!item)return '';
  const title=getLocalizedContent(item.title,lang),description=getLocalizedContent(item.description,lang),cover=certCoverAsset(item.id),proofs=certAssetList(item.id),safeCredential=safeLinkHref(item.credentialUrl);
  const grouped=[],seen=new Set();
  proofs.forEach((row,index)=>{if(row.asset_type==='gallery'&&row.gallery_id){if(seen.has(row.gallery_id))return;seen.add(row.gallery_id);const files=proofs.filter(asset=>asset.asset_type==='gallery'&&asset.gallery_id===row.gallery_id);grouped.push({row,index,files})}else grouped.push({row,index,files:[row]})});
  const evidence=grouped.map(({row,index,files})=>{const gallery=row.asset_type==='gallery',image=String(row.mime_type||'').toLowerCase().startsWith('image/'),canPreview=!!proofPreviewKind(row);const preview=gallery?`<div class="cert-evidence-thumbs">${files.slice(0,3).map(file=>`<img src="${esc(getAssetUrl(file))}" alt="${esc(file.original_name||title)}" loading="lazy">`).join('')}</div>`:image?`<img class="cert-evidence-thumb" src="${esc(getAssetUrl(row))}" alt="${esc(row.original_name||title)}" loading="lazy">`:'';const name=gallery?(currentLang==='en'?'Image gallery':'Bộ ảnh minh chứng'):(row.original_name||title);const type=gallery?(currentLang==='en'?'Gallery':'Bộ ảnh'):mediaTypeLabel(row);const copy=`<span class="cert-evidence-copy"><strong>${esc(name)}</strong><small>${esc(type)}${files.length>1?` · ${files.length}`:''}</small>${canPreview?'':`<span class="cert-evidence-downloads">${files.map(file=>{const fileName=file.original_name||name,url=getAssetUrl(file),download=proofDownloadUrl(url,fileName);return `<a class="viewer-btn" href="${esc(download)}" download="${esc(fileName)}" data-proof-download="${esc(url)}" data-proof-download-name="${esc(fileName)}">${esc(currentLang==='en'?'Download':'Tải')} · ${esc(fileName)} ↓</a>`}).join('')}</span>`}</span>`;return canPreview?`<button class="cert-evidence-item" type="button" data-cert-view="${esc(item.id)}|${index}">${preview}${copy}<span aria-hidden="true">↗</span></button>`:`<div class="cert-evidence-item">${preview}${copy}</div>`}).join('');
  return `<article class="case-article cert-detail"><header class="case-article-header"><button class="modal-close" type="button" data-close="case" aria-label="${esc(t('modal.close'))}">✕</button><div class="case-hero-meta"><span>${esc(getLocalizedContent(normalizedCertGroupTitle(item.id),lang))}</span><span>${esc(String(item.issuer||''))}</span></div><h1 class="case-hero-title">${esc(title)}</h1>${cover?`<figure class="cert-detail-cover"><img src="${esc(getAssetUrl(cover))}" alt="${esc(title)}" loading="eager"></figure>`:''}${description?`<p class="case-hero-lead">${esc(description)}</p>`:''}<div class="cert-detail-meta">${item.issuer?`<div><span>${esc(t('cert.issuer'))}</span><strong>${esc(item.issuer)}</strong></div>`:''}${item.date?`<div><span>${esc(t('cert.date'))}</span><strong>${esc(item.date)}</strong></div>`:''}${safeCredential?`<a href="${esc(safeCredential)}" target="_blank" rel="noopener noreferrer">${esc(t('cert.verify'))} ↗</a>`:''}</div></header><section class="case-article-body cert-detail-evidence"><h2>${esc(t('cert.evidence'))}</h2>${evidence||`<p class="case-copy">${esc(t('cert.noEvidence'))}</p>`}</section></article>`;
}

function normalizedCertGroupTitle(id){return normalizeCertGroups(getGlobalContent().experience.certGroups).find(group=>group.items.some(item=>item.id===id))?.title||{vi:'Chứng chỉ & Thành tựu',en:'Certificates & Achievements'}}





function mediaTypeLabel(row){
  const mime=String(row?.mime_type||'').toLowerCase(),type=String(row?.asset_type||row?.type||'').toLowerCase();
  if(type==='gallery')return currentLang==='en'?'Gallery':'Gallery';
  if(mime.startsWith('image/'))return currentLang==='en'?'Image':'Hình ảnh';
  if(mime.startsWith('video/'))return currentLang==='en'?'Video':'Video';
  if(mime==='application/pdf'||type==='pdf')return 'PDF';
  if(mime==='application/json'||type==='json')return 'JSON';
  if(mime.startsWith('audio/')||type==='audio')return 'Audio';
  const ex=String(row?.original_name||row?.file_name||'').toLowerCase().match(/\.([a-z0-9]+)$/);
  return ex?ex[1].toUpperCase():'File';
}

function formatMediaBytes(n){return formatAssetSize(n)}

function assetForBlock(assetId){const row=getAsset(assetId);return row?{...row,url:getAssetUrl(row)}:null;}

function renderBlock(block,lang,context={}){
  const c=block.content||{},s=block.settings||{},text=esc(String(c[`text_${lang}`]??c.text??''));
  const title=esc(String(c[`title_${lang}`]??c[`caption_${lang}`]??''));
  switch(block.type){
    case 'heading': return `<h3 class="case-block-heading">${title||text}</h3>`;
    case 'paragraph': return text?`<p class="case-copy">${text.replace(/\r?\n/g,'<br>')}</p>`:'';
    case 'richtext': { const html=sanitizeRichText(String(c[`text_${lang}`]??c.text??'')); return html?`<div class="case-copy case-richtext">${html}</div>`:''; }
    case 'quote': return `<blockquote class="case-pull-quote">${text}</blockquote>`;
    case 'list': { const items=Array.isArray(c[`items_${lang}`])?c[`items_${lang}`]:Array.isArray(c.items)?c.items:[]; return items.length?`<ul class="case-block-list">${items.map(x=>`<li>${esc(String(x))}</li>`).join('')}</ul>`:''; }
    case 'divider': return `<hr class="case-block-divider">`;
    case 'image': { const a=assetForBlock(s.asset_id); if(!a)return `<div class="article-media-placeholder">${esc(title|| (lang==='en'?'Image placeholder':'Vị trí hình ảnh'))}</div>`; const alt=String(c[`alt_${lang}`]||c.alt||a.original_name||''); const caption=esc(String(c[`caption_${lang}`]??c[`caption_${lang==='en'?'vi':'en'}`]??'')); return `<figure class="article-media"><img src="${esc(a.url)}" alt="${esc(alt)}" loading="lazy" style="width:auto;height:auto;max-width:100%;object-fit:contain"><figcaption>${caption}</figcaption></figure>`; }
    case 'gallery': { const ids=Array.isArray(s.asset_ids)?s.asset_ids:[]; const assets=ids.map(assetForBlock).filter(Boolean); return assets.length?`<figure class="article-media"><div class="gallery">${assets.map(a=>`<img src="${esc(a.url)}" alt="${esc(a.original_name||'')}" loading="lazy">`).join('')}</div><figcaption>${title}</figcaption></figure>`:`<div class="article-media-placeholder">${esc(title||(lang==='en'?'Gallery placeholder':'Vị trí gallery'))}</div>`; }
    case 'video': { const url=safeEmbedUrl(s.url||c.url||''),directUrl=safeDirectVideoUrl(url),va=assetForBlock(s.asset_id),poster=assetForBlock(s.poster_asset_id),posterAttr=poster&&String(poster.mime_type||'').toLowerCase().startsWith('image/')?` poster="${esc(poster.url)}"`:''; if(directUrl)return `<figure class="article-media"><video data-visibility-video src="${esc(directUrl)}"${posterAttr} controls playsinline preload="none"></video><figcaption>${title}</figcaption></figure>`; if(url)return `<figure class="article-media"><div class="case-video"><iframe src="${esc(url)}" title="${esc(title||'Video')}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><figcaption>${title}</figcaption></figure>`; if(va&&String(va.mime_type||'').toLowerCase().startsWith('video/'))return `<figure class="article-media"><video data-visibility-video src="${esc(va.url)}"${posterAttr} controls playsinline preload="none"></video><figcaption>${title}</figcaption></figure>`; return ''; }
    case 'workflow': { const items=Array.isArray(c[`items_${lang}`])?c[`items_${lang}`]:Array.isArray(c.items)?c.items:[]; return items.length?`<figure class="article-media"><div class="case-flow">${items.map((x,i)=>`<div class="case-flow-step"><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(String(x))}</strong></div>`).join('')}</div><figcaption>${title}</figcaption></figure>`:''; }
    case 'proof': { const a=assetForBlock(s.asset_id); return a?`<div class="proof-actions"><button class="proof-action-btn" type="button" data-open-asset="${esc(a.id)}" data-action="open">${esc(lang==='en'?'Open evidence':'Mở bằng chứng')}</button></div>`:''; }
    case 'file': { const a=assetForBlock(s.asset_id); if(!a)return `<div class="article-media-placeholder">${esc(title||(lang==='en'?'File placeholder':'Vị trí file'))}</div>`; const name=String(a.original_name||a.file_name||title||'file'); const download=proofDownloadUrl(a.url,name); return `<div class="case-file-card"><strong>${esc(name)}</strong><a href="${esc(download)}" download="${esc(name)}" data-proof-download="${esc(a.url)}" data-proof-download-name="${esc(name)}">${esc(lang==='en'?'Download':'Tải xuống')} ↓</a></div>`; }
    case 'cta': return `<div class="case-cta">${esc(String(c[`text_${lang}`]??c.text??c[`title_${lang}`]??c.title??''))}</div>`;
    default: return '';
  }
}

function renderBlockDocument(value,lang,section){
  const doc=blocksForSection({...section,blocks:value});
  return doc.items.map(block=>renderBlock(block,lang,{section})).join('');
}

let projectDbState='fallback';

let projectLoadPromise=null;

const PROJECT_FALLBACK=PROJECTS.slice();

function projectRuntimeFromDb(row,sections){
  const categories=Array.isArray(row.categories)?row.categories:[];
  const stats=Array.isArray(row.stats)?row.stats:[];
  const ordered=(sections||[]).sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0));
  const storyVi=ordered.map(s=>[s.title_vi||s.title_en||'',s.body_vi||s.body_en||'']);
  const storyEn=ordered.map(s=>[s.title_en||s.title_vi||'',s.body_en||s.body_vi||'']);
  const sectionDocs=ordered.map(s=>({...s,__legacyBody:!blocksAreAuthored(s.blocks),blocks:normalizeBlockDocument(s.blocks,s.body_vi,s.body_en)}));
  const baseTone=PROJECT_FALLBACK.find(p=>p.id===row.slug)?.tone||['#22d3ee','#5b7cfa'];
  const fallbackVisual=PROJECT_FALLBACK.find(p=>p.id===row.slug)?.visual||'web';
  return {
    id:row.slug,
    dbId:row.id,
    index:String(row.sort_order??1).padStart(2,'0'),
    tone:[safeCssColor(row.tone_a||baseTone[0],baseTone[0]),safeCssColor(row.tone_b||baseTone[1],baseTone[1])],
    visual:row.visual_type||fallbackVisual,
    published:row.published!==false,
    content:{
      vi:{category:categories,title:row.title_vi,hook:row.hook_vi||'',stats,intro:row.intro_vi||'',story:storyVi},
      en:{category:categories,title:row.title_en,hook:row.hook_en||'',stats,intro:row.intro_en||'',story:storyEn}
    },
    sections:sectionDocs,
    proof:[]
  };
}

async function fetchProjectRows(){const response=await sbFetch('/rest/v1/portfolio_projects?select=id,slug,sort_order,published,title_vi,title_en,hook_vi,hook_en,intro_vi,intro_en,categories,stats,visual_type,tone_a,tone_b&published=eq.true&order=sort_order.asc,id.asc',{method:'GET'},null);return response.json()}

async function fetchProjectSections({projectIds=[]}={}){if(!projectIds.length)return [];const url=new URL('/rest/v1/portfolio_project_sections',location.origin);url.searchParams.set('select','id,project_id,sort_order,title_vi,body_vi,title_en,body_en,blocks');url.searchParams.set('order','sort_order.asc,id.asc');url.searchParams.set('project_id',`in.(${projectIds.map(id=>encodeURIComponent(id)).join(',')})`);const response=await sbFetch(url.pathname+url.search,{method:'GET'},null);return response.json()}

async function loadProjects(){if(!sbReady()){projectDbState='not_configured';HQVShared.emit('projects');return false}if(projectLoadPromise)return projectLoadPromise;const work=(async()=>{try{const rows=await fetchProjectRows();if(!Array.isArray(rows))throw new Error('project_rows_invalid');if(rows.length===0){projectDbState='empty';PROJECTS.splice(0,PROJECTS.length);HQVShared.emit('projects');return true}const sections=await fetchProjectSections({projectIds:rows.map(row=>row.id)});const byProject=new Map();(Array.isArray(sections)?sections:[]).forEach(section=>{if(!byProject.has(section.project_id))byProject.set(section.project_id,[]);byProject.get(section.project_id).push(section)});PROJECTS.splice(0,PROJECTS.length,...rows.map(row=>projectRuntimeFromDb(row,byProject.get(row.id)||[])));projectDbState='ready';HQVShared.emit('projects');return true}catch(error){projectDbState=classifySupabaseError(error);PROJECTS.splice(0,PROJECTS.length,...PROJECT_FALLBACK);HQVShared.emit('projects');return false}finally{projectLoadPromise=null}})();projectLoadPromise=work;return work}

let insightDbState='fallback';
let insightLoadPromise=null;
const insightCovers=new Map();

function insightRuntimeFromDb(row,sections){
  const categories=Array.isArray(row.categories)?row.categories:[];
  const ordered=(Array.isArray(sections)?sections:[]).sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0)||String(a.id||'').localeCompare(String(b.id||'')));
  const storyVi=ordered.map(section=>[section.title_vi||section.title_en||'',section.body_vi||section.body_en||'']);
  const storyEn=ordered.map(section=>[section.title_en||section.title_vi||'',section.body_en||section.body_vi||'']);
  return {kind:'insight',id:row.slug,dbId:row.id,index:String(row.sort_order??0).padStart(2,'0'),tone:[safeCssColor(row.tone_a||'#22d3ee'),safeCssColor(row.tone_b||'#a78bfa')],visual:'web',published:row.published===true,readMinutes:Math.max(1,Number(row.read_minutes)||1),publishedAt:row.published_at||null,content:{vi:{category:categories,title:row.title_vi,hook:row.excerpt_vi||'',intro:row.intro_vi||'',stats:[],story:storyVi},en:{category:categories,title:row.title_en,hook:row.excerpt_en||'',intro:row.intro_en||'',stats:[],story:storyEn}},sections:ordered.map(section=>({...section,__legacyBody:!blocksAreAuthored(section.blocks),blocks:normalizeBlockDocument(section.blocks,section.body_vi,section.body_en)})),proof:[]};
}

async function loadInsights(){
  if(!sbReady()){insightDbState='not_configured';INSIGHTS.splice(0,INSIGHTS.length,...deepClone(INSIGHT_FALLBACK));attachInsightAssets();HQVShared.emit('insights');return false}
  if(insightLoadPromise)return insightLoadPromise;
  insightLoadPromise=(async()=>{try{
    const response=await sbFetch('/rest/v1/portfolio_insights?select=id,slug,sort_order,published,title_vi,title_en,excerpt_vi,excerpt_en,intro_vi,intro_en,categories,tone_a,tone_b,read_minutes,published_at&published=eq.true&order=sort_order.asc,id.asc',{method:'GET'},null);
    const rows=await response.json();if(!Array.isArray(rows))throw new Error('insight_rows_invalid');
    const sections=rows.length?await (async()=>{const r=await sbFetch(`/rest/v1/portfolio_insight_sections?select=id,insight_id,sort_order,title_vi,body_vi,title_en,body_en,blocks&insight_id=in.(${rows.map(row=>encodeURIComponent(row.id)).join(',')})&order=sort_order.asc,id.asc`,{method:'GET'},null);return r.json()})():[];
    const byInsight=new Map();(Array.isArray(sections)?sections:[]).forEach(section=>{if(!byInsight.has(section.insight_id))byInsight.set(section.insight_id,[]);byInsight.get(section.insight_id).push(section)});
    INSIGHTS.splice(0,INSIGHTS.length,...(rows.length?rows.map(row=>insightRuntimeFromDb(row,byInsight.get(row.id)||[])):deepClone(INSIGHT_FALLBACK)));insightDbState=rows.length?'ready':'empty';attachInsightAssets();HQVShared.emit('insights');return true;
  }catch(error){insightDbState=classifySupabaseError(error);INSIGHTS.splice(0,INSIGHTS.length,...deepClone(INSIGHT_FALLBACK));attachInsightAssets();HQVShared.emit('insights');return false}finally{insightLoadPromise=null}})();
  return insightLoadPromise;
}

function projectBySlug(slug){return PROJECTS.find(p=>p.id===slug)||PROJECT_FALLBACK.find(p=>p.id===slug)||null}

function contentFor(p){return p.content[currentLang]||p.content.vi}

function safeCssColor(value,fallback='#22d3ee'){
  const raw=String(value||'').trim();
  return /^#[0-9a-fA-F]{3,8}$/.test(raw)?raw:fallback;
}

function projectVideoCover(project){
  const ratios=new Set(['auto','portrait','square','landscape']);
  for(const section of project.sections||[]){
    const blocks=normalizeBlockDocument(section.blocks,section.body_vi,section.body_en).items;
    for(const block of blocks){
      const settings=block.settings||{},ratio=settings.cover_ratio;
      if(block.type!=='video'||!ratios.has(ratio))continue;
      const asset=assetForBlock(settings.asset_id);
      const directUrl=safeDirectVideoUrl(settings.url||'')||(asset&&String(asset.mime_type||'').toLowerCase().startsWith('video/')?safeDirectVideoUrl(asset.url):'');
      if(!directUrl)continue;
      const poster=assetForBlock(settings.poster_asset_id);
      return {url:directUrl,ratio,poster:poster&&String(poster.mime_type||'').toLowerCase().startsWith('image/')?poster.url:''};
    }
  }
  return null;
}

function visualH(p){
  const c=contentFor(p),isInsight=p.kind==='insight';
  const cover=isInsight?insightCovers.get(p.id):projectCovers.get(p.id);
  const videoCover=isInsight?null:projectVideoCover(p);
  const shell=inner=>`<div class="mock-window"><div class="mock-top"><div class="window-dots"><span class="window-dot"></span><span class="window-dot"></span><span class="window-dot"></span></div><div class="window-label">${isInsight?'INSIGHT':'CASE'} ${esc(p.index)} · ${esc(p.id)}</div></div><div class="mock-body">${inner}</div></div>`;
  if(videoCover){const initialRatio=videoCover.ratio==='auto'?'landscape':videoCover.ratio,enableSound=currentLang==='en'?'Enable sound':'Bật âm thanh',muteVideo=currentLang==='en'?'Mute video':'Tắt tiếng video';return `<div class="project-video-stage project-video-stage--${initialRatio}" data-cover-ratio="${videoCover.ratio}"><video data-visibility-video data-project-cover-video data-src="${esc(videoCover.url)}"${videoCover.poster||cover?.url?` poster="${esc(videoCover.poster||cover.url)}"`:''} loop playsinline preload="none" aria-hidden="true"></video><button class="mock-video-sound" type="button" data-video-sound-toggle data-enable-label="${enableSound}" data-mute-label="${muteVideo}" aria-label="${enableSound}" aria-pressed="false">${enableSound}</button></div>`}
  if(cover)return shell(`<div class="mock-cover"><img src="${esc(cover.url)}" alt="${esc(c.title)} ${isInsight?'insight':'project'} cover" loading="lazy"><div class="mock-cover-label"><span><b>${isInsight?'INSIGHT COVER':'PROJECT COVER'}</b> · ${isInsight?'INSIGHT':'CASE'} ${esc(p.index)}</span><span>${esc(c.category[0]||(isInsight?'Insight':'Project'))}</span></div></div>`);
  if(p.visual==='workflow')return shell(`<div class="workflow"><div class="node cold">DATA SOURCE</div><div class="arrow">→</div><div class="node">EXTRACTION</div><div class="arrow">→</div><div class="node hot">AI PROCESSING</div><div class="arrow">→</div><div class="node hot">INTENT</div><div class="arrow">→</div><div class="node">JSON</div><div class="arrow">→</div><div class="node cold">TELEGRAM</div></div>`);
  if(p.visual==='research')return shell(`<div class="data-panel"><div class="metric-box"><div class="metric"><strong style="color:var(--lime)">0.849</strong><span>KMO</span></div><div class="metric"><strong style="color:var(--cyan)">68.7%</strong><span>Variance</span></div><div class="metric"><strong>0.694</strong><span>R²</span></div><div class="metric"><strong>0.679</strong><span>Adjusted R²</span></div></div><div class="bars"><div class="bar"><span>responses</span><i style="--w:88%"></i><b>193</b></div><div class="bar"><span>hypotheses</span><i style="--w:57%"></i><b>4/7</b></div></div></div>`);
  if(p.visual==='research2')return shell(`<div class="timeline"><div class="time-row"><span class="time-label">04/2025</span><div class="time-body">Project start · university-level research</div></div><div class="time-row"><span class="time-label">ĐTTĐ2425-20</span><div class="time-body">Applied AI + education research</div></div><div class="time-row"><span class="time-label">20,000,000</span><div class="time-body">Approved project budget · VND</div></div><div class="time-row"><span class="time-label">03/2026</span><div class="time-body">Project end</div></div></div>`);
  if(p.visual==='design')return shell(`<div class="arch"><div class="primary">UTT_Design_Net_V1 · LoRA</div><div>76 images</div><div class="blue">ControlNet</div><div>Canny Edge</div><div>SDXL</div><div class="blue">Preset</div><div>~80% structure</div></div>`);
  if(p.visual==='journey')return shell(`<div class="journey"><div class="journey-step"><div class="journey-no">01</div><div class="journey-text">Market Context</div></div><div class="journey-step"><div class="journey-no">02</div><div class="journey-text">Customer Profile</div></div><div class="journey-step"><div class="journey-no">03</div><div class="journey-text">Consumer Insight</div></div><div class="journey-step"><div class="journey-no">04</div><div class="journey-text">Creative Idea</div></div><div class="journey-step"><div class="journey-no">05</div><div class="journey-text">Channels + Media Direction</div></div></div>`);
  return shell(`<div class="arch"><div class="primary">Marketing Problem</div><div>Claude Code</div><div class="blue">MCP</div><div>API</div><div>Git / GitHub</div><div class="blue">Prototype</div><div>Structured Output</div></div>`);
}
























function proofTitle(x){return currentLang==='en'?(x.titleEn||x.titleVi||x.title): (x.titleVi||x.titleEn||x.title)}

function proofVerb(type){return t(`proof.${type}`)}

function validProof(x){return !!(x&&(x.url||x.file||(Array.isArray(x.files)&&x.files.length)))}

function proofDownloadUrl(url,name){const separator=url.includes('?')?'&':'?';return `${url}${separator}download=${encodeURIComponent(name||'proof')}`}

function proofPreviewKind(item){const type=String(item?.type||'').toLowerCase(),mime=String(item?.mime_type||'').toLowerCase(),name=String(item?.original_name||item?.file_name||item?.url||item?.file||'').split('?')[0].toLowerCase(),extension=name.match(/\.([a-z0-9]+)$/)?.[1]||'';if(type==='pdf'||mime==='application/pdf'||extension==='pdf')return 'pdf';if(['doc','docx','xls','xlsx','ppt','pptx'].includes(extension)||mime==='application/msword'||mime==='application/vnd.ms-excel'||mime==='application/vnd.ms-powerpoint'||mime.includes('openxmlformats-officedocument'))return 'office';if(type==='json'||mime.startsWith('text/')||['application/json','application/xml','application/rtf'].includes(mime)||['txt','csv','tsv','json','xml','md','log','rtf'].includes(extension))return 'text';return ''}

function caseProofHtml(p){
  const routePrefix=p.kind==='insight'?`#/insight/${p.id}`:`#/${p.id}`;
  return (p.proof||[]).map((x,i)=>{
    if(!validProof(x))return '';
    if(x.type==='link'||x.type==='download')return `<a class="proof-btn" href="${esc(x.url||x.file)}" target="_blank" rel="noopener">${esc(proofTitle(x)||proofVerb(x.type))} ↗</a>`;
    if(['pdf','image','gallery','json','video','audio','file'].includes(x.type)){const name=(x.original_name||proofTitle(x)||'proof').replace(/[\\/:*?"<>|]+/g,'_'),source=x.url||x.file,url=proofDownloadUrl(source,name),download=`<a class="proof-btn" href="${esc(url)}" download="${esc(name)}" data-proof-download="${esc(source)}" data-proof-download-name="${esc(name)}">${esc(currentLang==='en'?'Download':'Tải')}${proofTitle(x)?` · ${esc(proofTitle(x))}`:''} ↓</a>`;return proofPreviewKind(x)?`<span class="proof-download-actions"><a class="proof-btn" href="${esc(routePrefix)}/${i}">${esc(currentLang==='en'?'Open':'Mở')}${proofTitle(x)?` · ${esc(proofTitle(x))}`:''} →</a>${download}</span>`:download}
    return `<a class="proof-btn" href="${esc(x.url||x.file||'#')}" target="_blank" rel="noopener">${esc(proofTitle(x)||proofVerb(x.type)||'Open proof')} ↗</a>`;
  }).join('');
}

function articleMediaHtml(p){
  const c=contentFor(p);
  const isInsight=p.kind==='insight',cover=isInsight?insightCovers.get(p.id):projectCovers.get(p.id);
  if(cover){
    return `<figure class="article-media article-media--hero article-media--full"><img src="${esc(cover.url)}" alt="${esc(c.title)} ${isInsight?'insight':'project'} cover"></figure>`;
  }
  return `<figure class="article-media article-media--visual article-media--full">${visualH(p)}<figcaption>${esc(p.kind==='insight'?(currentLang==='en'?'Insight visual':'Hình ảnh của Insight'):(currentLang==='en'?'Project visual':'Hình ảnh trực quan của Project'))}</figcaption></figure>`;
}

function articleMetaHtml(p,c,techItems){
  const items=[];
  if(c.category?.length)items.push(`${esc(currentLang==='en'?'Category':'Danh mục')} · ${esc(c.category.join(' · '))}`);
  if(p.visual&&p.kind!=='insight')items.push(`${esc(currentLang==='en'?'Type':'Loại')} · ${esc(p.visual)}`);
  if(techItems.length)items.push(`${esc(currentLang==='en'?'Technology':'Công nghệ')} · ${esc(techItems.slice(0,4).join(' · '))}`);
  return items.length?`<div class="case-article-meta">${items.map(x=>`<span>${x}</span>`).join('')}</div>`:'';
}

function articleProjectNav(p){
  const isInsight=p.kind==='insight',visible=(isInsight?INSIGHTS:PROJECTS).filter(x=>x.published!==false);
  const i=visible.findIndex(x=>x.id===p.id);if(i<0)return '';
  const prev=visible[i-1],next=visible[i+1];
  const label=isInsight?(currentLang==='en'?{prev:'Previous insight',next:'Next insight',explore:'Explore another insight'}:{prev:'Insight trước',next:'Insight tiếp theo',explore:'Khám phá Insight khác'}):(currentLang==='en'?{prev:'Previous project',next:'Next project',explore:'Explore another project'}:{prev:'Project trước',next:'Project tiếp theo',explore:'Khám phá Project khác'});
  const links=[];
  if(prev)links.push(`<a href="${isInsight?'#/insight/':'#/'}${esc(prev.id)}"><small>${esc(label.prev)}</small><strong>${esc(contentFor(prev).title)}</strong></a>`);
  if(next)links.push(`<a href="${isInsight?'#/insight/':'#/'}${esc(next.id)}"><small>${esc(label.next)}</small><strong>${esc(contentFor(next).title)}</strong></a>`);
  if(!links.length)return '';
  return `<footer class="case-footer"><div class="case-footer-label">${esc(label.explore)}</div><nav class="case-project-nav" aria-label="${esc(label.explore)}">${links.join('')}</nav></footer>`;
}

function caseHtml(p){
  const c=contentFor(p);
  const story=Array.isArray(c.story)?c.story:[];
  const byIndex=i=>story[i]||['',''];
  const proof=caseProofHtml(p);
  const tech=story.find(([label])=>/^(công nghệ|technology|tech stack)$/i.test(String(label||'')))||byIndex(3);
  const techItems=String(tech[1]||'').split('·').map(x=>x.trim()).filter(Boolean);
  const locale=currentLang==='en';
  const labels=locale?{
    eyebrow:p.kind==='insight'?'Insight · Digital Editorial':'Case Study · Digital Editorial',
    project:p.kind==='insight'?'Insight':'Project',
    type:'Type',
    technology:'Technology',
    system:'The System',
    data:'Data / Output',
    logic:'AI / Intent Logic',
    application:'Marketing Application',
    evidence:'Evidence / Proof',
    demonstrates:'What This Project Demonstrates',
    workflow:'Workflow',
    output:'Structured output',
    logicLead:'The current workflow turns extracted information into structured lead signals through AI processing, intent classification and routing.',
    demo:'Marketing problem → data extraction → AI processing → structured output → actionable workflow',
    media:'Project visual',
    proofOpen:'Open evidence'
  }:{
    eyebrow:p.kind==='insight'?'Insight · Bài viết chuyên đề':'Case Study · Bài viết chuyên đề',
    project:p.kind==='insight'?'Insight':'Project',
    type:'Loại',
    technology:'Công nghệ',
    system:'Hệ thống',
    data:'Dữ liệu / Đầu ra',
    logic:'AI / Logic nhận diện ý định',
    application:'Ứng dụng Marketing',
    evidence:'Bằng chứng / Proof',
    demonstrates:'Dự án thể hiện',
    workflow:'Luồng xử lý',
    output:'Dữ liệu có cấu trúc',
    logicLead:'Workflow hiện tại chuyển thông tin được trích xuất thành lead signal có cấu trúc thông qua AI processing, intent classification và routing.',
    demo:'Bài toán Marketing → trích xuất dữ liệu → xử lý bằng AI → dữ liệu có cấu trúc → workflow có thể hành động',
    media:'Hình ảnh trực quan của Project',
    proofOpen:'Mở bằng chứng'
  };

    const sectionDocs=Array.isArray(p.sections)&&p.sections.length?p.sections:story.map(([label,text])=>({title_vi:label,title_en:label,body_vi:text,body_en:text,__legacyBody:true,blocks:legacyParagraphDocument(text,text)}));
    const sections=sectionDocs.map((section,i)=>{const label=locale?(section.title_en||section.title_vi||labels.system):(section.title_vi||section.title_en||labels.system);const rendered=renderBlockDocument(section.blocks, currentLang==='en'?'en':'vi', section);return `<section class="case-section"><div class="case-section-head"><div class="case-section-no">${String(i+1).padStart(2,'0')}</div><div><p class="case-section-kicker">${esc(label)}</p><h2>${esc(label)}</h2>${rendered}</div></div></section>`}).join('');
    const proofSection=proof?`<section class="case-section case-evidence"><div class="case-section-head"><div class="case-section-no">${String(sectionDocs.length+1).padStart(2,'0')}</div><div><p class="case-section-kicker">${esc(labels.evidence)}</p><h2>${esc(labels.evidence)}</h2><div class="proof-actions">${proof}</div></div></div></section>`:'';
    return `<article class="case-article${p.kind==='insight'?'':' '+(p.id==='lead-intent'?'case-lead-intent':'')}${p.kind==='insight'?`" data-content-kind="insight`:''}">
      <header class="case-article-header">
        <button class="modal-close" type="button" data-close="case" aria-label="${esc(t('modal.close'))}">✕</button>
        <div class="case-hero-meta"><span>${esc(labels.eyebrow)}</span><span>${esc(c.category?.join(' · ')||labels.project)}</span></div>
        <h1 class="case-hero-title">${esc(c.title)}</h1>
        <p class="case-hero-lead">${esc(c.intro)}</p>
        <p class="case-hero-hook">${esc(c.hook)}</p>
        ${articleMetaHtml(p,c,techItems)}
        <div class="case-hero-visual">${articleMediaHtml(p)}</div>
        ${statsH(c.stats)}
      </header>
      <div class="case-article-body">${sections}${proofSection}</div>
      ${articleProjectNav(p)}
    </article>`;
}

















function sbReady(){return !!(CONFIG.supabase.url&&CONFIG.supabase.anonKey)}

function sbHeaders(token){return {'apikey':CONFIG.supabase.anonKey,'Authorization':`Bearer ${token||CONFIG.supabase.anonKey}`,'Content-Type':'application/json'}}

function jwtExpired(token){try{const payload=JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));return Number(payload.exp||0)*1000<=Date.now()+5000}catch(_){return true}}

function databaseJwtExpiredResponse(status,detail){return status===401&&/jwt|token|expired|invalid.*session/i.test(detail||'')||status===400&&/jwt|token|expired|invalid.*session/i.test(detail||'')}

async function sbFetch(path,opts={},tokenOverride,attempt=0){if(!sbReady())throw new Error('supabase_not_configured');const auth=HQVShared.auth;const useAuthenticatedToken=tokenOverride===undefined&&auth?.isAuthed?.();const token=tokenOverride===undefined?(useAuthenticatedToken?await auth.ensureFresh():null):tokenOverride;const headers={...sbHeaders(token),...(opts.headers||{})};let response;try{response=await fetch(CONFIG.supabase.url.replace(/\/$/,'')+path,{...opts,headers})}catch(error){const wrapped=new Error('supabase_network_error');wrapped.cause=error;throw wrapped}if(response.status===401&&useAuthenticatedToken&&!attempt){try{await auth.refresh();return sbFetch(path,opts,undefined,1)}catch(error){auth.onExpired?.();throw error}}if(!response.ok){let detail='';try{detail=await response.text()}catch(_){}const error=new Error('supabase_'+response.status);error.status=response.status;error.detail=detail;throw error}return response}

async function authToken(){const auth=HQVShared.auth;if(!auth?.isAuthed?.())throw new Error('supabase_auth_error');return auth.ensureFresh()}

function classifySupabaseError(err){
  if(!sbReady())return 'not_configured';
  if(err?.message==='supabase_network_error'||err?.name==='TypeError'&&!err?.status)return 'network';
  const status=Number(err?.status)||Number(String(err?.message||'').match(/supabase_(\d+)/)?.[1]||0);
  if(status===401)return 'auth';
  if(status===403)return 'permission';
  const text=String([err?.code,err?.detail,err?.messageText,err?.details,err?.hint,err?.message].filter(Boolean).join(' ')).toLowerCase();
  const schemaCode=/\b(?:pgrst204|pgrst205)\b/i.test(text);
  const schemaText=/(?:column|relation|table) .* (?:does not exist|not found)|could not find the (?:table|relation)|schema cache/i.test(text);
  if((status===400||status===404)&& (schemaCode||schemaText))return 'schema_missing';
  return 'error';
}

function publicUrl(path){const base=CONFIG.supabase.url.replace(/\/$/,'');return `${base}/storage/v1/object/public/${CONFIG.supabase.bucket}/${path.split('/').map(encodeURIComponent).join('/')}`}

let assetSchemaReady=null;

let assetLoadState='unknown';

let profileAvatar=null;

const projectCovers=new Map();

const assetRegistry=new Map();

let assetLoadPromise=null;

function assetRowsForProof(rows,project){
  return rows.filter(row=>{const belongs=(row.owner_id===project.id)||(row.project_id===project.id);const kind=row.asset_type||'proof';const ownerType=row.owner_type||'project';return ownerType==='project'&&belongs&&(kind==='proof'||kind==='gallery')});
}

function attachInsightAssets(){
  for(const insight of INSIGHTS){
    insight.proof=buildProofs([...assetRegistry.values()].filter(row=>row.owner_type==='insight'&&row.owner_id===insight.id&&(row.asset_type==='proof'||row.asset_type==='gallery')));
    const cover=[...assetRegistry.values()].find(row=>row.owner_type==='insight'&&row.owner_id===insight.id&&row.asset_type==='insight_cover');
    if(cover)insightCovers.set(insight.id,{...cover,url:publicUrl(cover.storage_path)});else insightCovers.delete(insight.id);
  }
}

function buildProofs(rows){
  const groups=new Map();
  rows.forEach(row=>{const key=row.gallery_id||`single:${row.id}`;let g=groups.get(key);if(!g){g={id:row.gallery_id||row.id,type:row.gallery_id?'gallery':row.type,titleVi:row.title_vi||row.title_en||row.original_name,titleEn:row.title_en||row.title_vi||row.original_name,original_name:row.original_name||'',created_at:row.created_at,files:[]};groups.set(key,g)}g.files.push(publicUrl(row.storage_path));if(!g.original_name&&row.original_name)g.original_name=row.original_name;if(row.created_at>g.created_at)g.created_at=row.created_at});
  return [...groups.values()].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).map(g=>g.type==='gallery'?{type:'gallery',titleVi:g.titleVi,titleEn:g.titleEn,original_name:g.original_name,files:g.files,url:g.files[0]}:{type:g.type,titleVi:g.titleVi,titleEn:g.titleEn,original_name:g.original_name,file:g.files[0],url:g.files[0],files:g.type==='image'?[g.files[0]]:undefined});
}

async function loadLegacyProofsForProject(project){
  const q=`/rest/v1/portfolio_proofs?select=id,project_id,owner_type,owner_id,type,title_vi,title_en,storage_path,original_name,mime_type,file_size,gallery_id,created_at&project_id=eq.${encodeURIComponent(project.id)}&or=(owner_type.eq.project,owner_type.is.null)&order=created_at.desc`;
  const r=await sbFetch(q,{method:'GET'},null);const rows=await r.json();project.proof=buildProofs(rows);return project.proof;
}

async function loadAssets(){if(!sbReady()){assetLoadState='not_configured';assetSchemaReady=null;attachInsightAssets();HQVShared.emit('assets');return}if(assetLoadPromise)return assetLoadPromise;assetLoadPromise=(async()=>{try{const table=encodeURIComponent(CONFIG.supabase.assetTable);const q='/rest/v1/'+table+'?select=id,project_id,asset_type,owner_type,owner_id,type,title_vi,title_en,storage_path,original_name,mime_type,file_size,gallery_id,sort_order,created_at&order=created_at.desc';const response=await sbFetch(q,{method:'GET'},null);const rows=await response.json();assetSchemaReady=true;assetLoadState='ready';assetRegistry.clear();rows.forEach(row=>assetRegistry.set(row.id,row));certAssets.clear();rows.filter(row=>(row.owner_type==='certificate'||row.owner_type==='experience')&&row.owner_id).sort((a,b)=>String(a.created_at||'').localeCompare(String(b.created_at||''))).forEach(row=>{if(!certAssets.has(row.owner_id))certAssets.set(row.owner_id,[]);certAssets.get(row.owner_id).push(row)});const avatar=rows.find(row=>row.asset_type==='avatar'&&row.owner_type==='profile'&&row.owner_id==='hqv');profileAvatar=avatar?{...avatar,url:publicUrl(avatar.storage_path)}:null;projectCovers.clear();for(const project of PROJECTS){const cover=rows.find(row=>row.asset_type==='project_cover'&&row.owner_type==='project'&&row.owner_id===project.id);if(cover)projectCovers.set(project.id,{...cover,url:publicUrl(cover.storage_path)});project.proof=buildProofs(assetRowsForProof(rows,project))}attachInsightAssets()}catch(error){const kind=classifySupabaseError(error);assetLoadState=kind;assetSchemaReady=kind==='schema_missing'?false:null;if(kind==='schema_missing')await Promise.all(PROJECTS.map(project=>loadLegacyProofsForProject(project).catch(()=>[])))}finally{attachInsightAssets();assetLoadPromise=null;HQVShared.emit('assets')}})();return assetLoadPromise}

async function loadProofsForProject(project){
  if(!sbReady())return project.proof||[];
  if(assetLoadState==='schema_missing')return loadLegacyProofsForProject(project);
  await loadAssets();
  if(assetLoadState==='schema_missing')return loadLegacyProofsForProject(project);
  return project.proof||[];
}

async function loadAllProofs(){if(!sbReady())return;await loadAssets()}



function formatAssetSize(size){const n=Number(size);if(!Number.isFinite(n)||n<0)return '';if(n<1024)return `${n} B`;if(n<1048576)return `${(n/1024).toFixed(1)} KB`;if(n<1073741824)return `${(n/1048576).toFixed(1)} MB`;return `${(n/1073741824).toFixed(1)} GB`}


Object.assign(HQVShared,{CONFIG,I18N,PROJECTS,PROJECT_FALLBACK,SKILLS,INSIGHTS,INSIGHT_FALLBACK,insightCovers,CERTS,certAssets,currentLang,lang:currentLang,normalizeBlockDocument,renderBlock,sanitizeRichText,safeLinkHref,sbReady,sbHeaders,sbFetch,authToken,publicUrl,esc,$,$$,loadProjects,loadInsights,loadAssets,loadAllProofs,attachInsightAssets,loadGlobalPublished,composeGlobalContent,caseHtml,globalFallbackContent,getGlobalContent,projectBySlug,mediaTypeLabel,formatAssetSize});
HQVShared.setLang=next=>{if(next!=='vi'&&next!=='en')return;currentLang=next;safeStorageSet(getWebStorage('localStorage'),'hqv-lang',currentLang);HQVShared.emit('lang')};
Object.defineProperty(HQVShared,'lang',{get:()=>currentLang,set:value=>HQVShared.setLang(value)});
window.HQVShared=HQVShared;