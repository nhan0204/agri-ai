# 🌾 Agri-AI: AI-Powered Content Remix & Voiceover Tool  

## 📌 Background  
Many smallholder farmers in Southeast Asia are increasingly turning to **TikTok** for practical agricultural knowledge—such as identifying and treating crop diseases, using crop protection products, and improving yields.  

A Digital Innovation team within a leading agrochemical company is building a platform to improve engagement with these farmers via TikTok. This platform will eventually include:  

- 📈 Content automation  
- 🎥 Creator intelligence  
- 🚀 Channel growth  
- 🎯 Lead optimisation  

Before committing to a full build, the team is testing out **core features** through prototypes.  

This repository demonstrates a **prototype** for:  

## 🎯 Scope 2: AI-Powered Content Remix & Voiceover Tool  

### The Challenge  
Smallholder farmers engage most with **relatable, localized content**. To streamline content creation, we want to remix existing videos—combining **voice, scenes, captions, and insights**—to generate new, AI-powered content tailored to this audience.  

---

## 📸 Product Showcase  

### Landing Page  
![Landing Page](https://i.postimg.cc/8CN9239k/landingpage.png)  

### Prototype UI  
![Prototype UI](https://i.postimg.cc/dV8gSvWS/prototype.png)  

🔗 Live demo: [Fermy AgriTech Prototype](https://v0-fermy-landing-page-theta-one.vercel.app/)  

---

## ⚙️ How It Works  

The remix tool guides users through **5 main steps**:  

1. 📥 **Upload Videos** – Provide TikTok/YouTube links or upload files  
2. ✨ **Extract Insights** – AI transcription + keyword detection (e.g. “pest control”, “irrigation”)  
3. 🌱 **Generate Script** – AI writes new localized scripts tailored for farmers  
4. 🎙️ **Voiceover & Preview** – Generate multi-language voiceovers  
5. 🎬 **Generated Mix Video** – Output remixed video draft with captions and audio  

---

## 🎬 5 Remixing Strategies for Agricultural TikTok Videos  

1. **Clip Highlight Remix**  
   - Extract the top 15–30 seconds with the **most engaging moment** (e.g. showing crop disease symptoms clearly).  
   - Add overlay captions + localized voiceover.  

2. **Multi-Video Mashup**  
   - Combine **insights from different farmers** into one educational reel.  
   - Example: Pest identification tip (video 1) + organic treatment method (video 2).  

3. **Before & After Storytelling**  
   - Reorder clips to **show problem → solution → outcome**.  
   - Add narration for storytelling flow (e.g. “This farmer struggled with pests, but after treatment…”).  

4. **Localized Language Remix**  
   - Same clip reused, but **different TTS voiceovers** in Filipino, Vietnamese, Thai, Malay.  
   - Boosts relatability and regional engagement.  

5. **Insight-Driven Cutdowns**  
   - AI extracts **3–4 key insights** and turns them into **short educational reels**.  
   - Example: “Step 1: Prepare soil”, “Step 2: Apply organic fertilizer”.  

---

## 🚀 Getting Started  

### 1️⃣ Clone Repo  
```bash
git clone https://github.com/nhan0204/agri-ai.git
cd agri-ai
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Set Up Environment Variables  
Create `.env.local`:  
```env
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 4️⃣ Run Development Server  
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)  

---

## 🛠️ Roadmap  
- [ ] Support multi-language transcription (Filipino, Vietnamese, Thai, Malay)  
- [ ] Automatic caption/subtitle generation  
- [ ] Scene detection for more precise editing  
- [ ] Farmer co-creation module (upload + AI-enhance videos)  
- [ ] Deploy beta for testing  

---

## 👨‍🌾 Why This Matters  
By simplifying content remix and voiceover creation, this tool empowers **digital engagement teams** to scale **localized, farmer-friendly TikTok content**—helping smallholder farmers improve yields, fight crop diseases, and adopt sustainable practices.  

---

## 📜 License  
MIT License © 2025 [Nhan0204](https://github.com/nhan0204)  
