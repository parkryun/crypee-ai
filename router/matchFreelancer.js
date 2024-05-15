require('dotenv').config()
const prompt = require('prompt-sync')()
const OpenAI = require('openai')
const fs = require('fs').promises
const path = require("path")
const router = require("express").Router()
const showdown = require("showdown")

// 업데이트 저장 변수
let conversationHistory = []

// 대화 이어나가는 함수
async function continueConversation(prompt) {

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })

        conversationHistory.push(
            {role: "user", content: "사업 주제를 적으면 그 사업에 어떤 직업이 필요한지 알려주는 프로그램을 만들거야 내가 직업군과 상세 직업을 차례대로 알려줄거야 잘 학습해"},
            {role: "user", content: `먼저 Accounting and Consulting 직업군과 관련된 직업을 차례대로 말해줄게
            1. Accounting
            2. Bookkeeping
            3. Business Analysis and Strategy
            4. Career Coaching
            5. Financial Analysis and Modeling
            6. Financial Management/CFO
            7. HR Administration
            8. Instructional Design
            9. Management Consulting
            10. Personal Coaching
            11. Recruiting and Talent Sourcing
            12. Tax Preparation
            13. Training and Development`},
            {role: "user", content: `Admin Support 직업군과 관련된 직업을 차례대로 말해줄게
            1. Business Project Management
            2. Construction and Engineering Project Management
            3. Data Entry
            4. Development and IT Project Management
            5. Digital Project Management
            6. Ecommerce Management
            7. Executive Virtual Assistance
            8. General Research Services
            9. General Virtual Assistance
            10. Healthcare Project Management
            11. Legal Virtual Assistance
            12. Manual Transcription
            13. Market Research
            14. Medical Virtual Assistance
            15. Personal Virtual Assistance
            16. Product Reviews
            17. Qualitative Research
            18. Quantitative Research
            19. Supply Chain and Logistics Project Management
            20. Web and Software Product Research`},
            {role: "user", content: `AI services 직업군과 관련된 직업을 차례대로 말해줄게
            1. AI Image Generation and Editing
            2. AI Speech and Audio Generation
            3. AI Video Generation and Editing
            4. AI Content Editing
            5. AI Content Writing
            6. AI Agent and Chatbot Development
            7. AI App Development
            8. AI API Integration
            9. AI Model Development
            10. MLOps
            11. AI Ethics and Compliance
            12. AI Tutoring
            13. Data Annotation and Labeling
            14. Data Mining and Cleaning
            15. Knowledge Representation`},
            {role: "user", content: `Engineering and Architecture 직업군과 관련된 직업을 차례대로 말해줄게
            1. 3D Modeling and Rendering
            2. Architectural Design
            3. Biology
            4. Building Information Modeling
            5. CAD
            6. Chemical and Process Engineering
            7. Chemistry
            8. Civil Engineering
            9. Electrical Engineering
            10. Electronic Engineering
            11. Energy Engineering
            12. Interior Design
            13. Landscape Architecture
            14. Logistics and Supply Chain Management
            15. Mathematics
            16. Mechanical Engineering
            17. Physics
            18. STEM Tutoring
            19. Sourcing and Procurement
            20. Structural Engineering
            21. Trade Show Design`},
            {role: "user", content: `Data Science and Analysis 직업군과 관련된 직업을 차례대로 말해줄게
            1. AI Data Annotation and Labeling
            2. Data Analytics
            3. Data Engineering
            4. Data Extraction
            5. Data Mining
            6. Data Processing
            7. Data Visualization
            8. Deep Learning
            9. Experimentation and Testing
            10. Generative AI Modeling
            11. Knowledge Representation
            12. Machine Learning`},
            {role: "user", content: `Customer Service 직업군과 관련된 직업을 차례대로 말해줄게
            1. Community Management
            2. Content Moderation
            3. Customer Onboarding
            4. Customer Success
            5. Email, Phone and Chat Support
            6 .IT Support
            7. Tech Support
            8. Visual Tagging and Processing`},
            {role: "user", content: `IT and Networking 직업군과 관련된 직업을 차례대로 말해줄게
            1. Business Applications Development
            2. Cloud Engineering
            3. Database Administration
            4. DevOps Engineering
            5. IT Compliance
            6. Information Security
            7. Network Administration
            8. Network Security
            9. Solution Architecture
            10. Systems Administration
            11. Systems Engineering`},
            {role: "user", content: `Design and Creative 직업군과 관련된 직업을 차례대로 말해줄게
            1. 2D Animation
            2. 3D Animation
            3. AI Image Generation and Editing
            4. AI Speech and Audio Generation
            5. AI Video Generation and Editing
            6. AR/VR Design
            7. Acting
            8. Art Direction
            9.  Audio Editing
            10. Audio Production
            11. Brand Identity Design
            12. Cartoons and Comics
            13. Creative Direction
            14. Editorial Design
            15. Fashion Design
            16. Fine Art
            17. Game Art
            18. Graphic Design
            19. Illustration
            20. Image Editing
            21. Jewelry Design
            22. Local Photography
            23. Logo Design
            24. Motion Graphics
            25. Music Performance
            26. Music Production
            27. NFT Art
            28. Packaging Design
            29. Pattern Design
            30. Portraits and Caricatures
            31. Presentation Design
            32. Product and Industrial Design
            33. Product Photography
            34. Singing
            35. Songwriting and Music Composition
            36. Video Editing
            37. Video Production
            38. Videography
            39. Visual Effects
            40. Voice Talent`},
            {role: "user", content: `Legal 직업군과 관련된 직업을 차례대로 말해줄게
            1. Business and Corporate Law
            2. Immigration Law
            3. Intellectual Property Law
            4. International Law
            5. Labor and Employment Law
            6. Paralegal Services
            7. Regulatory Law
            8. Securities and Finance Law
            9. Tax Law`},
            {role: "user", content: `Sales and Marketing 직업군과 관련된 직업을 차례대로 말해줄게
            1. Brand Strategy
            2. Campaign Management
            3. Content Strategy
            4. Display Advertising
            5. Email Marketing
            6. Lead Generation
            7. Marketing Automation
            8. Marketing Strategy
            9. Public Relations
            10. SEO
            11. Sales and Business Development
            12. Search Engine Marketing
            13. Social Media Marketing
            14. Social Media Strategy
            15. Telemarketing`},
            {role: "user", content: `Translation 직업군과 관련된 직업을 차례대로 말해줄게
            1. General Translation Services
            2. Language Localization
            3. Language Tutoring
            4. Legal Document Translation
            5. Live Interpretation
            6. Medical Document Translation
            7. Sign Language Interpretation
            8. Technical Document Translation`},
            {role: "user", content: `Web, Mobile, and Software Development 직업군과 관련된 직업을 차례대로 말해줄게
            1. AI Chatbot Development
            2. AI Integration
            3. AR/VR Development
            4. Automation Testing
            5. Back-End Development
            6. Blockchain and NFT Development
            7. CMS Development
            8. Coding Tutoring
            9. Crypto Coins and Tokens
            10. Crypto Wallet Development
            11. Database Development
            12. Desktop Software Development
            13. Ecommerce Website Development
            14. Emerging Tech
            15. Firmware Development
            16. Front-End Development
            17. Full Stack Development
            18. Manual Testing
            19. Mobile App Development
            20. Mobile Design
            21. Mobile Game Development
            22. Product Management
            23. Prototyping
            24. Scripting and Automation
            25. Scrum Leadership
            26. UX/UI Design
            27. Video Game Development
            28. Web Design`},
            {role: "user", content: `Writing 직업군과 관련된 직업을 차례대로 말해줄게
            1. AI Content Writing
            2. Academic and Research Writing
            3. Ad and Email Copywriting
            4. Article and Blog Writing
            5. Business and Proposal Writing
            6. Copy Editing
            7. Creative Writing
            8. Ghostwriting
            9. Grant Writing
            10. Legal Writing
            11. Marketing Copywriting
            12. Medical Writing
            13. Proofreading
            14. Resume and Cover Letter Writing
            15. Sales Copywriting
            16. Scriptwriting
            17. Technical Writing
            18. Web and UX Writing
            19. Writing Tutoring`},
            {role: "user", content: `답변할 때 다음과 같은 규칙을 지켜줘 1. 직업군, 직업 순서로 답변 2. 내가 알려준 영어 직업군과 직업명이랑 완전히 일치하게 답변 3. 세가지 종류의 서로 다른 직업군과 직업을 알려주는 답변`},
            {role: "user", content: `내가 html 형식으로 답변 예시를 보여줄게 앞으로 이렇게 답변해주면 돼
            ex) 
            <ol>
                <li>AI services & AI App Development </li>
                <li>IT and Networking & Cloud Engineering </li>
                <li>Sales and Marketing & Brand Strategy </li>
            </ol>
            `},
            {role: "user", content: "좋아 이제 물어볼게"},
            {role: "user", content: prompt}
        )
        

        // console.log(conversationHistory)

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: conversationHistory,
            max_tokens: 1000,
            
        })

        return response.choices[0].message

    } catch (error) {
        console.error('Error calling ChatGPT API:', error)
        return null
    }
}

router.post('/', async (req, res) => {
        
    const result = {
        "success": false,
        "message": null,
        "content": [],
        "test": []
    }

    try {
        const user_input = req.body.user_input

        if (!user_input) {
            throw new Error("No user input provided")
        }
        
        if (user_input.toLowerCase() === 'exit') {
            throw new Error("Conversation ended by user")
        }

        const gptResponse = await continueConversation(user_input)
        console.log(gptResponse)
        // markdown to HTML
        const converter = new showdown.Converter()
        const responseHTML = converter.makeHtml(gptResponse.content)
        
        const regex = /<li>(.*?)<\/li>/g; // 정규 표현식
        let match = null
        
        while ((match = regex.exec(responseHTML))) {
            // 해당 주제와 관련된 프리랜서가 존재하지 않을때
            if (match == null) { 
                result.success = false
                result.message = "Freelancer match failure"
                break
            }

            let job = match[1]
            let imgPath = null
            
            // Accounting and Consulting
            if (job.includes("Accounting and Consulting")) {
                imgPath = "Accounting and Consulting"
            }
            // Admin Support
            else if (job.includes("Admin Support")) {
                imgPath = "Admin Support"
            }
            // AI servives
            else if (job.includes("AI servives")) {
                imgPath = "AI servives"      
            }
            // Engineering and Architecture
            else if (job.includes("Engineering and Architecture")) {
                imgPath = "Engineering and Architecture"
            }
            // Data Science and Analysis
            else if (job.includes("Data Science and Analysis")) {
                imgPath = "Data Science and Analysis"
            }
            // IT and Networking
            else if (job.includes("IT and Networking")) {
                imgPath = "IT and Networking"
            }
            // Design and Creative
            else if (job.includes("Design and Creative")) {
                imgPath = "Design and Creative"
            }
            // Legal
            else if (job.includes("Legal")) {
                imgPath = "Legal"
            }
            // Sales and Marketing
            else if (job.includes("Sales and Marketing")) {
                imgPath = "Sales and Marketing"
            }
            // Translation
            else if (job.includes("Translation")) {
                imgPath = "Translation"
            }
            // Web, Mobile, and Software Development
            else if (job.includes("Web, Mobile, and Software Development")) {
                imgPath = "Web, Mobile, and Software Development"
            }
            // Writing
            else if (job.includes("Writing")) {
                imgPath = "Writing"
            }
            
            
            // 파일 존재 여부 확인
            try {
                await fs.access(imgPath, fs.constants.F_OK);
                // console.log(`${match[1]} exists.`);
                result.content.push({
                    job: job,
                    imgUrl:imgPath
                })
            } catch (err) {
                // console.error(`${match[1]} does not exist.`);
                result.content.push({
                    job: job,
                    imgUrl: null
                })
            }
        }

        console.log(result.content)

        result.success = true
        result.message = "Successful freelancer match"
    } catch(err) {
        result.message = err.message
    }

    res.json(result)
})

module.exports = router
