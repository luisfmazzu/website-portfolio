"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "pt"

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

interface TranslationProviderProps {
  children: ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load translations
    const loadTranslations = async () => {
      // In a real app, you would load these from JSON files or an API
      const translationsData = {
        en: {
          // Header
          "nav.home": "Home",
          "nav.about": "About",
          "nav.skills": "Skills",
          "nav.projects": "Projects",
          "nav.contact": "Contact",

          // Hero
          "hero.greeting": "Hi, I'm",
          "hero.subtitle":
            "A reliable problem solver who bridges technical execution and business needs, crafting efficient software while leading high-performing teams.",
          "hero.cta.viewWork": "My Work",
          "hero.cta.contact": "Contact Me",
          "hero.scrollDown": "Scroll Down",

          // About
          "about.title": "About Me",
          "about.description":
            "With over 8 years in software development, I've built complex backend services, led engineering teams, and delivered products in blockchain, gaming, AI, and agriculture. My experience spans from hands-on coding to tech leadership, ensuring that projects align with both technical excellence and business goals. I thrive in fast-paced environments where solving tough challenges and mentoring teams drive success.",

          // Why Hire Me
          "whyHireMe.title": "Why Hire Me",
          "whyHireMe.subtitle": "Here are some reasons why I'm the right developer for your project.",
          "whyHireMe.technicalExcellence.title": "Technical Excellence",
          "whyHireMe.technicalExcellence.description":
            "With expertise in modern web technologies, I deliver clean, maintainable, and efficient code that follows best practices.",
          "whyHireMe.problemSolving.title": "Problem Solver",
          "whyHireMe.problemSolving.description":
            "I approach challenges with analytical thinking and creativity, finding elegant solutions to complex problems.",
          "whyHireMe.efficiency.title": "Efficient & Reliable",
          "whyHireMe.efficiency.description":
            "I consistently deliver high-quality work on time, managing resources effectively to maximize productivity.",
          "whyHireMe.teamwork.title": "Team Player",
          "whyHireMe.teamwork.description":
            "As a team member, lead or manager, I collaborate effectively with cross-functional teams, communicating clearly and contributing positively to team dynamics.",
          "whyHireMe.fastLearner.title": "Fast Learner & Adaptable",
          "whyHireMe.fastLearner.description":
            "Quickly master new technologies and frameworks to meet market and project demands.",
          "whyHireMe.provenExpertise.title": "Proven Full-Stack Expertise",
          "whyHireMe.provenExpertise.description":
            "Over 8 years of hands-on experience architecting, deploying, and maintaining scalable backend and frontend solutions in production.",

          // Experience
          "experience.title": "My Experience",
          "experience.timeline": "My Experience Timeline",
          
          // Experience Jobs
          // Job 7
          "experience.job7.title": "Software Engineering Manager",
          "experience.job7.company": "Ocarina Studios",
          "experience.job7.period": "2024 - 2025",
          "experience.job7.description": "Managing software developers to develop applications ranging from gaming, blockchain and AI.",
          "experience.job7.responsibility1": "Collaborated with executive leadership to define and implement technology strategies that supported business growth, optimized resources, and maximized ROI.",
          "experience.job7.responsibility2": "Created comprehensive roadmaps, backlogs, and risk assessments for major products, maintaining stakeholder alignment and delivering high-quality releases on schedule.",
          "experience.job7.responsibility3": "Initiated technical training sessions and professional development plans, boosting team retention rates and improving skill diversity within the engineering team.",
          "experience.job7.responsibility4": "Introduced comprehensive documentation practices for systems and codebases, improving knowledge transfer and reducing onboarding time by 40%.",
          "experience.job7.responsibility5": "Established rapid prototyping and feedback processes, accelerating the development of new features and reducing the average time from concept to prototype by 50%.",
          
          // Job 6
          "experience.job6.title": "Full-Stack Engineer",
          "experience.job6.company": "Elixir Technologies Ltd.",
          "experience.job6.period": "2022 - 2024",
          "experience.job6.description": "Led the development of a decentralized market-making system, providing liquidity for exchanges across blockchain networks like Ethereum, Sui, and Solana.",
          "experience.job6.responsibility1": "Designed and built an innovative decentralized application for liquidity provisioning on the blockchain, enhancing market accessibility and efficiency. The project reached a trading volume in the billions of dollars and a Total Value Locked (TVL) exceeding 50 million dollars on May 2024.",
          "experience.job6.responsibility2": "Engineered a robust off-chain network incorporating a consensus layer, validator nodes, auditing mechanisms, and advanced market-making strategies. Designed systems capable of supporting over 100,000 validators.",
          "experience.job6.responsibility3": "Utilized Python, WebSockets, Kafka, Web3, and AWS to implement core network components, ensuring seamless communication and processing.",
          "experience.job6.responsibility4": "Developed the front end and managed integration with blockchain and off-chain services using TypeScript, JavaScript, React, and NextJS, delivering a cohesive user experience.",
          "experience.job6.responsibility5": "Actively contributed to system architecture design, prioritizing security and resilience against off-chain attack vectors to ensure robust performance.",
          "experience.job6.responsibility6": "Developed high-performance algorithms to maintain the system's Service Level Agreement (SLA) expectations.",
          
          // Job 5
          "experience.job5.title": "Full-Stack Software Engineer",
          "experience.job5.company": "Freelancer",
          "experience.job5.period": "2021 - 2023",
          "experience.job5.description": "Developed applications as a freelancer using multiple languages and delivering on time.",
          "experience.job5.responsibility1": "Project 1: Developed an irrigation mobile app, which provided data for user sensor hardware, current/forecast weather data and a proprietary algorithm. Responsible for leading the development of the backend services for user management, messagery, API connection and data analysis. Also helped the development of the mobile app frontend using React Native.",
          "experience.job5.responsibility2": "Project 2: Designed and developed a decentralized storage system to enable secure, distributed file storage with cryptographic verification. Led backend development and optimized performance. Improved file retrieval speeds by multiple times and reduced storage costs.",
          "experience.job5.responsibility3": "Project 3: Designed and developed an AI-Powered Web Scraping website, where users can scrape any website with the data they want to retrieve. The project has been developed as a full product.",
          
          // Job 4
          "experience.job4.title": "Interview Engineer Contractor",
          "experience.job4.company": "Karat",
          "experience.job4.period": "2021 - 2023",
          "experience.job4.description": "Interviewed globally with hundreds of candidates and evaluated algorithms in various programming languages.",
          "experience.job4.responsibility1": "Member of the interview engineering team, conducting over 100 technical assessments for a wide range of candidates and tech companies around the world.",
          "experience.job4.responsibility2": "Developed critical technical and communication skills necessary for dealing with a wide range of technologies, and programming best practices.",
          "experience.job4.responsibility3": "Conducted hundreds of interview reviews as part of the quality control team, ensuring robustness and adherence to best practices.",
          
          // Job 3
          "experience.job3.title": "Full-Stack Software Engineer Consultant",
          "experience.job3.company": "Ocarina Studios",
          "experience.job3.period": "2021 - 2023",
          "experience.job3.description": "Implemented frontend and backend applications used in audio and gaming software.",
          "experience.job3.responsibility1": "Led the engineering hiring process, participating as an interviewer for all positions within the company, resulting in dozens of new hires.",
          "experience.job3.responsibility2": "Developed apps for audio conversion to instruments, trivia creation/reviewing tools, gaming, etc. Responsible for leading the development of the backend services for user management, audio filters, and data analysis.",
          "experience.job3.responsibility3": "Developed websites (landing pages and tools) using JavaScript, TypeScript, React, NextJS, Figma.",
          "experience.job3.responsibility4": "Gathered software requirements, developed backlogs, estimated roadmaps, deadlines and risks, prioritized tasks, and fully managed the life cycle of projects. Initially worked with Scrum, but the process was adapted to the company's needs. Software used included Jira, Confluence, Trello, and Miro.",
          
          // Job 2
          "experience.job2.title": "Lead Software Engineer",
          "experience.job2.company": "Agres Electronic Systems",
          "experience.job2.period": "2017 - 2020",
          "experience.job2.description": "Specialized in leading the development of embedded systems and new products.",
          "experience.job2.responsibility1": "Initially served as a key member of the GeoNave software team, supporting the company's agriculture automation product, deployed over 1,000,000 devices; responsibilities included code maintenance and feature development using C, C++, Qt, and Rust.",
          "experience.job2.responsibility2": "Developed the Seeding Monitor feature, significantly optimizing manual operations and reducing errors during the seeding phase, resulting in a 100% increase in product sales within one year.",
          "experience.job2.responsibility3": "Designed and built an API for GIS data processing, user management, and real-time operations.",
          "experience.job2.responsibility4": "Spearheaded the development of Agronave Pro, the company's latest embedded system for agriculture automation, enabling Level 3 autosteering capabilities and enhancing code reusability and security within critical system components.",
          "experience.job2.responsibility5": "Conducted comprehensive requirements gathering and developed a detailed backlog for Agronave Pro, with full ownership of project lifecycle management, including roadmap creation, risk assessment, and task prioritization, leading to the successful delivery of a complete product in two years.",
          "experience.job2.responsibility6": "Led the engineering hiring process, managing end-to-end recruitment activities and conducting interviews for all software roles, resulting in a 300% expansion of the engineering team.",
          "experience.job2.responsibility7": "Influenced and assisted the implementation of Scrum as an Agile methodology for all software teams, modifying processes according to needs and restrictions, increasing productivity and employee satisfaction.",
          "experience.job2.responsibility8": "Mentored and supervised interns and engineers, achieving rapid career advancement from software developer to development lead and product owner within one year.",
          
          // Job 1
          "experience.job1.title": "Junior Software Engineer",
          "experience.job1.company": "Tales Inc.",
          "experience.job1.period": "2016 - 2017",
          "experience.job1.description": "Started my career developing internal software for production and automation with computer vision.",
          "experience.job1.responsibility1": "Contributed to the internal software systems team focused on production, directly impacting the productivity and quality of chip, SIM card, and credit card manufacturing.",
          "experience.job1.responsibility2": "Responsible for maintenance and development of internal tools to adapt new needs, guaranteeing the industry operability and reinforcing the correct flow of processes by workers.",
          "experience.job1.responsibility3": "Developed a tool for gathering performance and product completion data, assisting the process team in finding bottlenecks in the production flow.",
          "experience.job1.responsibility4": "Supported the automation of machinery through the integration of programmable logic controllers (PLCs) and computer vision, reducing manual operations by more than 50% and increasing quality assurance by over 50%.",
          
          // Common Experience Terms
          "responsibilities": "Responsibilities",
          "visitWebsite": "Visit Website",
          "viewDetails": "View Details",
          "showEarlierExperience": "Show Earlier Experience",
          "hideEarlierExperience": "Hide Earlier Experience",

          // Skills
          "skills.title": "My Skills",
          "skills.description": "These are the technologies and tools I work with to bring ideas to life.",
          "skills.categories.all": "All Skills",
          "skills.categories.frontend": "Frontend",
          "skills.categories.backend": "Backend",
          "skills.categories.other": "Other",

          // Projects
          "projects.title": "My Projects",
          "projects.description": "Browse through my recent work and personal projects.",
          "projects.filter.all": "All",
          "projects.cta.moreInfo": "More Info",
          "projects.cta.sourceCode": "Source Code",
          
          // Project 1
          "projects.project1.title": "Elixir Protocol",
          "projects.project1.description": "A full-featured decentralized market-making platform in the blockchain.",
          "projects.project1.detail1": "Designed and built an innovative decentralized application for liquidity provisioning on the blockchain, enhancing market accessibility and efficiency. The project reached a trading volume in the billions of dollars and a Total Value Locked (TVL) exceeding 50 million dollars on May 2024.",
          "projects.project1.detail2": "Engineered a robust off-chain network incorporating a consensus layer, validator nodes, auditing mechanisms, and advanced market-making strategies. Designed systems capable of supporting over 100,000 validators.",
          "projects.project1.detail3": "Utilized Python, WebSockets, Kafka, Web3, and AWS to implement core network components, ensuring seamless communication and processing in many blockchain networks (Ethereum, Sui, Arbitrum, Solana).",
          "projects.project1.detail4": "Developed the front end and managed integration with blockchain and off-chain services using TypeScript, JavaScript, React, and NextJS, delivering a cohesive user experience.",
          "projects.project1.detail5": "Actively contributed to system architecture design, prioritizing security and resilience against off-chain attack vectors to ensure robust performance.",
          "projects.project1.detail6": "Developed high-performance algorithms to maintain the system's Service Level Agreement (SLA) expectations.",
          "projects.project1.company": "Elixir Technologies Ltd.",
          "projects.project1.role": "Senior Full-Stack Engineer",
          
          // Project 2
          "projects.project2.title": "Vintality",
          "projects.project2.description": "An irrigation mobile app, which provided data for user sensor hardware, current/forecast weather data and a proprietary algorithm",
          "projects.project2.detail1": "Led backend development for an irrigation app using NodeJS, NestJS, and AWS, creating scalable services for user management, messaging, and API integrations.",
          "projects.project2.detail2": "Implemented RabbitMQ for efficient data processing and real-time communication between services.",
          "projects.project2.detail3": "Ensured seamless data flow between hardware, backend, and the mobile frontend.",
          "projects.project2.detail4": "Contributed to the React Native mobile app frontend, enhancing user experience with intuitive data visualization and real-time updates.",
          "projects.project2.detail5": "Collaborated with the design team to ensure UI consistency and performance.",
          "projects.project2.detail6": "Deployed and managed cloud infrastructure on AWS, optimizing cost and scalability for backend services and databases.",
          "projects.project2.company": "Vintality Tech Inc.",
          "projects.project2.role": "Lead Full Stack Developer",
          
          // Project 3
          "projects.project3.title": "Portfolio Website",
          "projects.project3.description": "Personal portfolio website showcasing projects and skills. The one you are seeing right now!",
          "projects.project3.detail1": "Designed and developed this personal portfolio website using TypeScript, Next.js, TypeScript, Tailwind CSS, and AWS.",
          "projects.project3.detail2": "Implemented responsive design for all device sizes",
          "projects.project3.detail3": "Created smooth animations and transitions",
          "projects.project3.detail4": "Built a contact form with email integration",
          "projects.project3.detail5": "Built a contribution graph for git data with GitHub and GitLab integration",
          "projects.project3.detail6": "Optimized performance with Next.js static generation",
          "projects.project3.detail7": "Implemented dark mode with theme persistence",
          "projects.project3.detail8": "Implemented translation system",
          "projects.project3.role": "Full-Stack Engineer",
          
          // Project 4
          "projects.project4.title": "Nebula Storage",
          "projects.project4.description": "A decentralized storage and content distribution network (CDN) built on top of Ethereum and IPFS (InterPlanetary File System).",
          "projects.project4.detail1": "Developed a distributed file storage solution using Golang, Gin, IPFS, and Solidity (Ethereum smart contracts), ensuring secure and tamper-proof data storage.",
          "projects.project4.detail2": "Implemented content-defined chunking with Merkle trees and Kademlia DHT to efficiently store and retrieve files across nodes.",
          "projects.project4.detail3": "Used Reed-Solomon encoding to reduce storage overhead by 40% while maintaining high availability and fault tolerance.",
          "projects.project4.detail4": "Designed a retrieval mechanism using supernode caching and DHT lookups, improving file access speeds by 10x.",
          "projects.project4.detail5": "Built a high-performance API using Gin, enabling fast file uploads, metadata management, and seamless user authentication.",
          "projects.project4.role": "Senior Full Stack Developer",
          
          // Project 5
          "projects.project5.title": "Agronave PRO",
          "projects.project5.description": "Dashboard for tracking and analyzing social media performance metrics.",
          "projects.project5.detail1": "Key contributor to GeoNave, maintaining and enhancing features in C, C++, Qt, and Rust for an agriculture automation product deployed on over 1M devices.",
          "projects.project5.detail2": "Developed the Seeding Monitor, reducing manual errors and boosting sales by 100% in one year.",
          "projects.project5.detail3": "Ensured seamless integration with existing hardware and software components.",
          "projects.project5.company": "Agres Electronic Systems",
          "projects.project5.role": "Lead Software Engineer",
          
          // Project 6 - 16
          "projects.project6.title": "Scrape Sense AI",
          "projects.project6.description": "An AI-powered web scraping platform that enables users to extract and structure data from any website using customizable queries.",
          "projects.project6.role": "Full Stack Engineer",
          
          "projects.project7.title": "TriviaGen AI",
          "projects.project7.description": "An AI-powered application that scrapes data, generates accurate trivia questions with correct answers, and creates plausible distractors.",
          "projects.project7.company": "Ocarina Studios Inc.",
          "projects.project7.role": "Full Stack Engineer",
          
          "projects.project8.title": "Google Accelerator Program",
          "projects.project8.description": "One of 60 studios worldwide selected for Google's accelerator, gaining expert mentorship on game analytics and business strategy.",
          "projects.project8.company": "Ocarina Studios Inc.",
          "projects.project8.role": "Software Engineering Manager",
          
          // Common Project Terms
          "projects.companyLabel": "Project by",
          "projects.roleLabel": "My Role:",
          "projects.detailsLabel": "Project Details:",
          "projects.contributionLabel": "My Contribution:",
          "projects.companySiteLabel": "Company Site",
          "projects.downloadsLabel": "Downloads:",
          "projects.moreInfoLabel": "More Info",
          
          // Contact
          "contact.title": "Get In Touch",
          "contact.description": "Have a project in mind or want to collaborate? Feel free to reach out!",
          "contact.phone.title": "Phone",
          "contact.phone.description": "Call me directly",
          "contact.email.title": "Email",
          "contact.email.description": "Send me an email",
          "contact.location.title": "Location",
          "contact.location.description": "My current location",
          "contact.form.title": "Send Me a Message",
          "contact.form.description": "Fill out the form below and I'll get back to you as soon as possible.",
          "contact.form.name": "Name",
          "contact.form.email": "Email",
          "contact.form.subject": "Subject",
          "contact.form.message": "Message",
          "contact.form.submit": "Send Message",
          "contact.form.sending": "Sending...",

          // Footer
          "footer.tagline": "Building digital experiences that make a difference.",
          "footer.copyright": "All rights reserved.",

          // Language
          "language.english": "English",
          "language.portuguese": "Portuguese",

          // Chatbot
          "chatbot.title": "Portfolio Assistant",
          "chatbot.subtitle": "Ask me anything about my work",
          "chatbot.greeting":
            "👋 Hi there! I'm the portfolio assistant. How can I help you today? You can ask about my experience, skills, or freelance work.",
          "chatbot.placeholder": "Type your message...",
          "chatbot.typing": "Typing...",
          "chatbot.experience":
            "I have over 7 years of experience in web development, starting as a Junior Developer in 2016 and progressing to a Principal Engineer role. I've worked with various technologies and led multiple successful projects across different industries.",
          "chatbot.skills":
            "My core skills include JavaScript/TypeScript, React, Next.js, Node.js, and various backend technologies. I'm also experienced with database systems, cloud platforms, and modern development workflows.",
          "chatbot.freelance":
            "I'm available for freelance projects! I specialize in building modern web applications, e-commerce solutions, and custom software. Let me know what you're looking for, and we can discuss how I can help bring your vision to life.",
          "chatbot.contact":
            "You can reach me via email at luisfmazzu@gmail.com or by phone at +55 (41) 99700-3955. I'm also available through the contact form on this website.",
          "chatbot.thanks": "You're welcome! If you have any other questions, feel free to ask. I'm here to help!",
          "chatbot.fallback":
            "I'm not sure I understand that question. Could you try rephrasing it? You can ask about my experience, skills, or freelance work.",
        },
        pt: {
          // Header
          "nav.home": "Início",
          "nav.about": "Sobre",
          "nav.skills": "Habilidades",
          "nav.projects": "Projetos",
          "nav.contact": "Contato",

          // Hero
          "hero.greeting": "Olá, eu sou",
          "hero.subtitle":
            "Um solucionador de problemas confiável, que alia execução técnica às necessidades do negócio, criando software eficiente enquanto lidera equipes de alta performance.",
          "hero.cta.viewWork": "Ver Meu Trabalho",
          "hero.cta.contact": "Entre em Contato",
          "hero.scrollDown": "Rolar para Baixo",

          // About
          "about.title": "Sobre Mim",
          "about.description":
            "Com mais de 8 anos em desenvolvimento de software, construí sistemas backend complexos, liderei equipes de engenharia e entreguei produtos em blockchain, jogos, IA e agricultura. Minha experiência vai desde codificação hands-on até liderança técnica, garantindo que os projetos alinhem excelência técnica com objetivos de negócio. Sou movido por ambientes dinâmicos, onde resolver desafios complexos e mentorar times são prioridades.",

          // Why Hire Me
          "whyHireMe.title": "Por Que Me Contratar",
          "whyHireMe.subtitle": "Aqui estão algumas razões pelas quais sou o desenvolvedor certo para o seu projeto.",
          "whyHireMe.technicalExcellence.title": "Excelência Técnica",
          "whyHireMe.technicalExcellence.description":
            "Com expertise em tecnologias web modernas, entrego código limpo, sustentável e eficiente que segue as melhores práticas.",
          "whyHireMe.problemSolving.title": "Solucionador de Problemas",
          "whyHireMe.problemSolving.description":
            "Abordo desafios com pensamento analítico e criatividade, encontrando soluções elegantes para problemas complexos.",
          "whyHireMe.efficiency.title": "Eficiente & Confiável",
          "whyHireMe.efficiency.description":
            "Entrego consistentemente trabalho de alta qualidade no prazo, gerenciando recursos de forma eficaz para maximizar a produtividade.",
          "whyHireMe.teamwork.title": "Trabalho em Equipe",
          "whyHireMe.teamwork.description":
            "Seja como membro ou líder, colaboro efetivamente com equipes multifuncionais, comunicando-me claramente e contribuindo positivamente para a dinâmica da equipe.",
          "whyHireMe.fastLearner.title": "Aprendizado Rápido & Adaptabilidade",
          "whyHireMe.fastLearner.description":
            "Domino novas tecnologias e frameworks com agilidade para atender demandas do projeto e mercado.",
          "whyHireMe.provenExpertise.title": "Experiência Full-Stack Comprovada",
          "whyHireMe.provenExpertise.description":
            "8+ anos construindo e otimizando sistemas backend e frontend em produção.",

          // Experience
          "experience.title": "Minha Experiência",
          "experience.timeline": "Linha do Tempo da Minha Experiência",
          
          // Experience Jobs
          // Job 7
          "experience.job7.title": "Gerente de Engenharia de Software",
          "experience.job7.company": "Ocarina Studios",
          "experience.job7.period": "2024 - 2025",
          "experience.job7.description": "Gerenciando desenvolvedores de software para desenvolver aplicações que vão desde jogos, blockchain e IA.",
          "experience.job7.responsibility1": "Colaborei com a liderança executiva para definir e implementar estratégias tecnológicas que apoiaram o crescimento dos negócios, otimizaram recursos e maximizaram o ROI.",
          "experience.job7.responsibility2": "Criei roteiros abrangentes, backlogs e avaliações de risco para produtos principais, mantendo o alinhamento das partes interessadas e entregando lançamentos de alta qualidade no prazo.",
          "experience.job7.responsibility3": "Iniciei sessões de treinamento técnico e planos de desenvolvimento profissional, aumentando as taxas de retenção da equipe e melhorando a diversidade de habilidades dentro da equipe de engenharia.",
          "experience.job7.responsibility4": "Introduzi práticas abrangentes de documentação para sistemas e bases de código, melhorando a transferência de conhecimento e reduzindo o tempo de integração em 40%.",
          "experience.job7.responsibility5": "Estabeleci processos de prototipagem rápida e feedback, acelerando o desenvolvimento de novas funcionalidades e reduzindo o tempo médio do conceito ao protótipo em 50%.",
          
          // Job 6
          "experience.job6.title": "Engenheiro Full-Stack",
          "experience.job6.company": "Elixir Technologies Ltd.",
          "experience.job6.period": "2022 - 2024",
          "experience.job6.description": "Liderei o desenvolvimento de um sistema de criação de mercado descentralizado, fornecendo liquidez para trocas em redes blockchain como Ethereum, Sui e Solana.",
          "experience.job6.responsibility1": "Projetei e construí um aplicativo descentralizado inovador para provisão de liquidez na blockchain, melhorando a acessibilidade e eficiência do mercado. O projeto alcançou um volume de negociação na casa dos bilhões de dólares e um Total Value Locked (TVL) superior a 50 milhões de dólares em maio de 2024.",
          "experience.job6.responsibility2": "Engenhei uma robusta rede off-chain incorporando uma camada de consenso, nós validadores, mecanismos de auditoria e estratégias avançadas de criação de mercado. Projetei sistemas capazes de suportar mais de 100.000 validadores.",
          "experience.job6.responsibility3": "Utilizei Python, WebSockets, Kafka, Web3 e AWS para implementar componentes principais da rede, garantindo comunicação e processamento sem interrupções.",
          "experience.job6.responsibility4": "Desenvolvi o front end e gerenciei a integração com serviços blockchain e off-chain usando TypeScript, JavaScript, React e NextJS, entregando uma experiência de usuário coesa.",
          "experience.job6.responsibility5": "Contribuí ativamente para o design da arquitetura do sistema, priorizando segurança e resiliência contra vetores de ataque off-chain para garantir um desempenho robusto.",
          "experience.job6.responsibility6": "Desenvolvi algoritmos de alto desempenho para manter as expectativas do Acordo de Nível de Serviço (SLA) do sistema.",
          
          // Job 5
          "experience.job5.title": "Engenheiro de Software Full-Stack",
          "experience.job5.company": "Freelancer",
          "experience.job5.period": "2021 - 2023",
          "experience.job5.description": "Desenvolvi aplicações como freelancer usando múltiplas linguagens e entregando no prazo.",
          "experience.job5.responsibility1": "Projeto 1: Desenvolvi um aplicativo móvel de irrigação, que fornecia dados para hardware de sensores do usuário, dados meteorológicos atuais/previstos e um algoritmo proprietário. Responsável por liderar o desenvolvimento dos serviços de backend para gerenciamento de usuários, mensagens, conexão API e análise de dados. Também ajudei no desenvolvimento do frontend do aplicativo móvel usando React Native.",
          "experience.job5.responsibility2": "Projeto 2: Projetei e desenvolvi um sistema de armazenamento descentralizado para permitir armazenamento de arquivos distribuído seguro com verificação criptográfica. Liderei o desenvolvimento de backend e otimizei o desempenho. Melhorei as velocidades de recuperação de arquivos múltiplas vezes e reduzi os custos de armazenamento.",
          "experience.job5.responsibility3": "Projeto 3: Projetei e desenvolvi um site de Web Scraping com IA, onde os usuários podem extrair dados de qualquer site com os dados que desejam recuperar. O projeto foi desenvolvido como um produto completo.",
          
          // Job 4
          "experience.job4.title": "Contratado como Engenheiro de Entrevistas",
          "experience.job4.company": "Karat",
          "experience.job4.period": "2021 - 2023",
          "experience.job4.description": "Entrevistei globalmente centenas de candidatos e avaliei algoritmos em várias linguagens de programação.",
          "experience.job4.responsibility1": "Membro da equipe de engenharia de entrevistas, conduzindo mais de 100 avaliações técnicas para uma ampla gama de candidatos e empresas de tecnologia em todo o mundo.",
          "experience.job4.responsibility2": "Desenvolvi habilidades técnicas e de comunicação críticas necessárias para lidar com uma ampla gama de tecnologias e melhores práticas de programação.",
          "experience.job4.responsibility3": "Conduzi centenas de revisões de entrevistas como parte da equipe de controle de qualidade, garantindo robustez e aderência às melhores práticas.",
          
          // Job 3
          "experience.job3.title": "Consultor de Engenharia de Software Full-Stack",
          "experience.job3.company": "Ocarina Studios",
          "experience.job3.period": "2021 - 2023",
          "experience.job3.description": "Implementei aplicações frontend e backend usadas em software de áudio e jogos.",
          "experience.job3.responsibility1": "Liderei o processo de contratação de engenharia, participando como entrevistador para todas as posições dentro da empresa, resultando em dezenas de novas contratações.",
          "experience.job3.responsibility2": "Desenvolvi aplicativos para conversão de áudio em instrumentos, ferramentas de criação/revisão de trivias, jogos, etc. Responsável por liderar o desenvolvimento dos serviços de backend para gerenciamento de usuários, filtros de áudio e análise de dados.",
          "experience.job3.responsibility3": "Desenvolvi sites (páginas de destino e ferramentas) usando JavaScript, TypeScript, React, NextJS, Figma.",
          "experience.job3.responsibility4": "Reuni requisitos de software, desenvolvi backlogs, estimei roteiros, prazos e riscos, priorizei tarefas e gerenciei totalmente o ciclo de vida dos projetos. Inicialmente trabalhei com Scrum, mas o processo foi adaptado às necessidades da empresa. Software usado incluiu Jira, Confluence, Trello e Miro.",
          
          // Job 2
          "experience.job2.title": "Engenheiro de Software Líder",
          "experience.job2.company": "Agres Sistemas Eletrônicos",
          "experience.job2.period": "2017 - 2020",
          "experience.job2.description": "Especializado em liderar o desenvolvimento de sistemas embarcados e novos produtos.",
          "experience.job2.responsibility1": "Inicialmente atuei como membro-chave da equipe de software GeoNave, apoiando o produto de automação agrícola da empresa, implantado em mais de 1.000.000 de dispositivos; as responsabilidades incluíam manutenção de código e desenvolvimento de recursos usando C, C++, Qt e Rust.",
          "experience.job2.responsibility2": "Desenvolvi o recurso Monitor de Semeadura, otimizando significativamente as operações manuais e reduzindo erros durante a fase de semeadura, resultando em um aumento de 100% nas vendas do produto em um ano.",
          "experience.job2.responsibility3": "Projetei e construí uma API para processamento de dados GIS, gerenciamento de usuários e operações em tempo real.",
          "experience.job2.responsibility4": "Liderei o desenvolvimento do Agronave Pro, o mais recente sistema embarcado da empresa para automação agrícola, permitindo recursos de direção automática de Nível 3 e aprimorando a reutilização de código e segurança dentro de componentes críticos do sistema.",
          "experience.job2.responsibility5": "Realizei um levantamento abrangente de requisitos e desenvolvi um backlog detalhado para o Agronave Pro, com total propriedade do gerenciamento do ciclo de vida do projeto, incluindo criação de roteiro, avaliação de riscos e priorização de tarefas, levando à entrega bem-sucedida de um produto completo em dois anos.",
          "experience.job2.responsibility6": "Liderei o processo de contratação de engenharia, gerenciando atividades de recrutamento de ponta a ponta e conduzindo entrevistas para todas as funções de software, resultando em uma expansão de 300% da equipe de engenharia.",
          "experience.job2.responsibility7": "Influenciei e auxiliei na implementação do Scrum como metodologia Ágil para todas as equipes de software, modificando processos de acordo com necessidades e restrições, aumentando a produtividade e a satisfação dos funcionários.",
          "experience.job2.responsibility8": "Orientei e supervisionei estagiários e engenheiros, alcançando rápido avanço na carreira de desenvolvedor de software para líder de desenvolvimento e product owner em um ano.",
          
          // Job 1
          "experience.job1.title": "Engenheiro de Software Júnior",
          "experience.job1.company": "Tales Inc.",
          "experience.job1.period": "2016 - 2017",
          "experience.job1.description": "Iniciei minha carreira desenvolvendo software interno para produção e automação com visão computacional.",
          "experience.job1.responsibility1": "Contribuí para a equipe de sistemas de software interno focada em produção, impactando diretamente a produtividade e qualidade da fabricação de chips, cartões SIM e cartões de crédito.",
          "experience.job1.responsibility2": "Responsável pela manutenção e desenvolvimento de ferramentas internas para adaptar novas necessidades, garantindo a operabilidade da indústria e reforçando o fluxo correto de processos pelos trabalhadores.",
          "experience.job1.responsibility3": "Desenvolvi uma ferramenta para coletar dados de desempenho e conclusão de produtos, auxiliando a equipe de processos a encontrar gargalos no fluxo de produção.",
          "experience.job1.responsibility4": "Apoiei a automação de maquinário através da integração de controladores lógicos programáveis (PLCs) e visão computacional, reduzindo operações manuais em mais de 50% e aumentando a garantia de qualidade em mais de 50%.",
          
          // Common Experience Terms
          "responsibilities": "Responsabilidades",
          "visitWebsite": "Visitar Site",
          "viewDetails": "Ver Detalhes",
          "showEarlierExperience": "Mostrar Experiências Anteriores",
          "hideEarlierExperience": "Ocultar Experiências Anteriores",

          // Skills
          "skills.title": "Minhas Habilidades",
          "skills.description": "Estas são as tecnologias e ferramentas com as quais trabalho para dar vida às ideias.",
          "skills.categories.all": "Todas as Habilidades",
          "skills.categories.frontend": "Frontend",
          "skills.categories.backend": "Backend",
          "skills.categories.other": "Outras",

          // Projects
          "projects.title": "Meus Projetos",
          "projects.description": "Navegue pelos meus trabalhos recentes e projetos pessoais.",
          "projects.filter.all": "Todos",
          "projects.cta.moreInfo": "Mais Informações",
          "projects.cta.sourceCode": "Código Fonte",
          
          // Project 1
          "projects.project1.title": "Protocolo Elixir",
          "projects.project1.description": "Uma plataforma completa de criação de mercado descentralizada na blockchain.",
          "projects.project1.detail1": "Projetei e construí um aplicativo descentralizado inovador para provisão de liquidez na blockchain, melhorando a acessibilidade e eficiência do mercado. O projeto alcançou um volume de negociação na casa dos bilhões de dólares e um Total Value Locked (TVL) superior a 50 milhões de dólares em maio de 2024.",
          "projects.project1.detail2": "Engenhei uma robusta rede off-chain incorporando uma camada de consenso, nós validadores, mecanismos de auditoria e estratégias avançadas de criação de mercado. Projetei sistemas capazes de suportar mais de 100.000 validadores.",
          "projects.project1.detail3": "Utilizei Python, WebSockets, Kafka, Web3 e AWS para implementar componentes principais da rede, garantindo comunicação e processamento sem interrupções em várias redes blockchain (Ethereum, Sui, Arbitrum, Solana).",
          "projects.project1.detail4": "Desenvolvi o front end e gerenciei a integração com serviços blockchain e off-chain usando TypeScript, JavaScript, React e NextJS, entregando uma experiência de usuário coesa.",
          "projects.project1.detail5": "Contribuí ativamente para o design da arquitetura do sistema, priorizando segurança e resiliência contra vetores de ataque off-chain para garantir um desempenho robusto.",
          "projects.project1.detail6": "Desenvolvi algoritmos de alto desempenho para manter as expectativas do Acordo de Nível de Serviço (SLA) do sistema.",
          "projects.project1.company": "Elixir Technologies Ltd.",
          "projects.project1.role": "Engenheiro Full-Stack Sênior",
          
          // Project 2
          "projects.project2.title": "Vintality",
          "projects.project2.description": "Um aplicativo móvel de irrigação, que fornecia dados para hardware de sensores do usuário, dados meteorológicos atuais/previstos e um algoritmo proprietário",
          "projects.project2.detail1": "Liderei o desenvolvimento de backend para um aplicativo de irrigação usando NodeJS, NestJS e AWS, criando serviços escaláveis para gerenciamento de usuários, mensagens e integrações de API.",
          "projects.project2.detail2": "Implementei RabbitMQ para processamento eficiente de dados e comunicação em tempo real entre serviços.",
          "projects.project2.detail3": "Garantí o fluxo de dados perfeito entre hardware, backend e frontend móvel.",
          "projects.project2.detail4": "Contribuí para o frontend do aplicativo móvel React Native, aprimorando a experiência do usuário com visualização de dados intuitiva e atualizações em tempo real.",
          "projects.project2.detail5": "Colaborei com a equipe de design para garantir consistência de UI e desempenho.",
          "projects.project2.detail6": "Implantei e gerenciei infraestrutura em nuvem na AWS, otimizando custo e escalabilidade para serviços de backend e bancos de dados.",
          "projects.project2.company": "Vintality Tech Inc.",
          "projects.project2.role": "Desenvolvedor Full Stack Líder",
          
          // Project 3
          "projects.project3.title": "Website de Portfólio",
          "projects.project3.description": "Website de portfólio pessoal apresentando projetos e habilidades. O que você está vendo agora!",
          "projects.project3.detail1": "Projetei e desenvolvi este website de portfólio pessoal usando TypeScript, Next.js, TypeScript, Tailwind CSS e AWS.",
          "projects.project3.detail2": "Implementei design responsivo para todos os tamanhos de dispositivos",
          "projects.project3.detail3": "Criei animações e transições suaves",
          "projects.project3.detail4": "Construí um formulário de contato com integração de email",
          "projects.project3.detail5": "Construí um gráfico de contribuições para dados do Git com integração GitHub e GitLab",
          "projects.project3.detail6": "Otimizei o desempenho com geração estática do Next.js",
          "projects.project3.detail7": "Implementei modo escuro com persistência de tema",
          "projects.project3.detail8": "Implementei sistema de tradução",
          "projects.project3.role": "Engenheiro Full-Stack",
          
          // Project 4
          "projects.project4.title": "Nebula Storage",
          "projects.project4.description": "Uma rede de armazenamento descentralizada e distribuição de conteúdo (CDN) construída sobre Ethereum e IPFS (InterPlanetary File System).",
          "projects.project4.detail1": "Desenvolvi uma solução de armazenamento de arquivos distribuída usando Golang, Gin, IPFS e Solidity (contratos inteligentes Ethereum), garantindo armazenamento de dados seguro e à prova de adulteração.",
          "projects.project4.detail2": "Implementei divisão de conteúdo definida com árvores de Merkle e DHT Kademlia para armazenar e recuperar arquivos de forma eficiente entre nós.",
          "projects.project4.detail3": "Usei codificação Reed-Solomon para reduzir a sobrecarga de armazenamento em 40% enquanto mantinha alta disponibilidade e tolerância a falhas.",
          "projects.project4.detail4": "Projetei um mecanismo de recuperação usando cache de supernós e pesquisas DHT, melhorando a velocidade de acesso aos arquivos em 10x.",
          "projects.project4.detail5": "Construí uma API de alto desempenho usando Gin, permitindo uploads de arquivos rápidos, gerenciamento de metadados e autenticação de usuário perfeita.",
          "projects.project4.role": "Desenvolvedor Full Stack Sênior",
          
          // Project 5
          "projects.project5.title": "Agronave PRO",
          "projects.project5.description": "Dashboard para rastreamento e análise de métricas de desempenho em mídias sociais.",
          "projects.project5.detail1": "Contribuidor-chave para o GeoNave, mantendo e aprimorando recursos em C, C++, Qt e Rust para um produto de automação agrícola implantado em mais de 1 milhão de dispositivos.",
          "projects.project5.detail2": "Desenvolvi o Monitor de Semeadura, reduzindo erros manuais e aumentando as vendas em 100% em um ano.",
          "projects.project5.detail3": "Garantí integração perfeita com componentes de hardware e software existentes.",
          "projects.project5.company": "Agres Sistemas Eletrônicos",
          "projects.project5.role": "Engenheiro de Software Líder",
          
          // Project 6 - 16
          "projects.project6.title": "Scrape Sense AI",
          "projects.project6.description": "Uma plataforma de web scraping com IA que permite aos usuários extrair e estruturar dados de qualquer site usando consultas personalizáveis.",
          "projects.project6.role": "Engenheiro Full Stack",
          
          "projects.project7.title": "TriviaGen AI",
          "projects.project7.description": "Um aplicativo com IA que extrai dados, gera perguntas de trivialidades precisas com respostas corretas e cria distratores plausíveis.",
          "projects.project7.company": "Ocarina Studios Inc.",
          "projects.project7.role": "Engenheiro Full Stack",
          
          "projects.project8.title": "Programa Acelerador Google",
          "projects.project8.description": "Um dos 60 estúdios em todo o mundo selecionados para o acelerador do Google, obtendo mentoria especializada em análise de jogos e estratégia de negócios.",
          "projects.project8.company": "Ocarina Studios Inc.",
          "projects.project8.role": "Gerente de Engenharia de Software",
          
          // Common Project Terms
          "projects.companyLabel": "Projeto por",
          "projects.roleLabel": "Minha Função:",
          "projects.detailsLabel": "Detalhes do Projeto:",
          "projects.contributionLabel": "Minha Contribuição:",
          "projects.companySiteLabel": "Site da Empresa",
          "projects.downloadsLabel": "Downloads:",
          "projects.moreInfoLabel": "Mais Informações",
          
          // Contact
          "contact.title": "Entre em Contato",
          "contact.description":
            "Tem um projeto em mente ou quer colaborar? Sinta-se à vontade para entrar em contato!",
          "contact.phone.title": "Telefone",
          "contact.phone.description": "Ligue diretamente",
          "contact.email.title": "Email",
          "contact.email.description": "Envie-me um email",
          "contact.location.title": "Localização",
          "contact.location.description": "Minha localização atual",
          "contact.form.title": "Envie-me uma Mensagem",
          "contact.form.description": "Preencha o formulário abaixo e entrarei em contato o mais breve possível.",
          "contact.form.name": "Nome",
          "contact.form.email": "Email",
          "contact.form.subject": "Assunto",
          "contact.form.message": "Mensagem",
          "contact.form.submit": "Enviar Mensagem",
          "contact.form.sending": "Enviando...",

          // Footer
          "footer.tagline": "Construindo experiências digitais que fazem a diferença.",
          "footer.copyright": "Todos os direitos reservados.",

          // Language
          "language.english": "Inglês",
          "language.portuguese": "Português",

          // Chatbot
          "chatbot.title": "Assistente do Portfólio",
          "chatbot.subtitle": "Pergunte-me sobre meu trabalho",
          "chatbot.greeting":
            "👋 Olá! Sou o assistente do portfólio. Como posso ajudar você hoje? Você pode perguntar sobre minha experiência, habilidades ou trabalho freelance.",
          "chatbot.placeholder": "Digite sua mensagem...",
          "chatbot.typing": "Digitando...",
          "chatbot.experience":
            "Tenho mais de 7 anos de experiência em desenvolvimento web, começando como Desenvolvedor Júnior em 2016 e progredindo para o cargo de Engenheiro Principal. Trabalhei com várias tecnologias e liderei múltiplos projetos bem-sucedidos em diferentes setores.",
          "chatbot.skills":
            "Minhas principais habilidades incluem JavaScript/TypeScript, React, Next.js, Node.js e várias tecnologias de backend. Também tenho experiência com sistemas de banco de dados, plataformas em nuvem e fluxos de trabalho de desenvolvimento modernos.",
          "chatbot.freelance":
            "Estou disponível para projetos freelance! Sou especializado em construir aplicações web modernas, soluções de e-commerce e software personalizado. Diga-me o que você está procurando, e podemos discutir como posso ajudar a dar vida à sua visão.",
          "chatbot.contact":
            "Você pode me contatar por email em luisfmazzu@gmail.com ou por telefone em +55 (41) 99700-3955. Também estou disponível através do formulário de contato neste site.",
          "chatbot.thanks":
            "De nada! Se você tiver outras perguntas, sinta-se à vontade para perguntar. Estou aqui para ajudar!",
          "chatbot.fallback":
            "Não tenho certeza se entendi essa pergunta. Você poderia tentar reformulá-la? Você pode perguntar sobre minha experiência, habilidades ou trabalho freelance.",
        },
      }

      setTranslations(translationsData)
      setIsLoaded(true)
    }

    loadTranslations()
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    // In a real app, you might want to store this in localStorage
    localStorage.setItem("language", lang)
  }

  // Load language preference from localStorage on initial load
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "pt")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const t = (key: string): string => {
    if (!isLoaded) return key
    return translations[language]?.[key] || key
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}

