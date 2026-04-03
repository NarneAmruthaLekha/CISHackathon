# Web Vulnerability Scanner with Risk Visualization Dashboard

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen.svg" alt="Project Status">
  <img src="https://img.shields.io/badge/Frontend-React.js-blue.svg" alt="Frontend: React">
  <img src="https://img.shields.io/badge/Backend-Python-yellow.svg" alt="Backend: Python">
  <img src="https://img.shields.io/badge/Hackathon-Project-ff69b4.svg" alt="Hackathon">
</div>

---

## 1. Project Title & Overview

A vulnerability scanner is an automated tool designed to assess computers, networks, or applications for known weaknesses. As the complexity of web threats increases exponentially, navigating modern infrastructures poses an imminent risk, making it imperative to proactively identify insecure configurations or critical flaws before malevolent actors can exploit them. 

**"Web Vulnerability Scanner with Risk Visualization Dashboard"** addresses the growing threat of unsafe browsing and hidden digital pitfalls. Whether users unknowingly land on malicious phishing sites or deal with improperly secured websites, invisible threats run rampant. Our solution is highly useful because it abstracts the complexity of vulnerability detection. It provides users a unified, interactive dashboard to instantly discern the security standing of their digital footprint through an intuitive risk visualization structure, giving them both insight and actionable data at a glance.

## 2. Key Features

* **Advanced URL Scanning:** Rapidly tests provided URLs against known threat databases and security configuration baselines.
* **Intelligent Risk Classification:** Dynamically grades endpoints into explicit categories: **Low**, **Medium**, or **High** risk levels.
* **Persistent History Tracking:** Automatically stores scanned URLs in an append-only archive, providing a cohesive timeline of previously assessed websites.
* **Interactive Bar Graph Visualization:** Compiles scan outcomes into an easily digestible graphical representation spanning overall risk trends.
* **Granular Hover Modals:** Provides tooltips on dashboard graphs; hovering reveals specific URLs responsible for each risk quadrant instantaneously.
* **Real-Time Scanning Capabilities:** Fetches and analyzes security configurations locally upon request, providing near-instantaneous feedback.

## 3. Tech Stack

### Frontend
* **Core:** React.js, JavaScript, JSX, HTML5
* **Styling:** CSS3 / TailwindCSS
* **Libraries:** Chart.js / Recharts (for dynamic interactive bar graph generation), Axios (for API integrations)

### Backend
* **Core:** Python
* **Framework:** Flask / FastAPI
* **Libraries:** Requests, BeautifulSoup4, Security assessment modules

### Tooling & APIs
* Threaded concurrent request processing
* RESTful API architectural pattern between client and server

## 4. System Architecture

The project follows a robust Client-Server topological flow:

1. **Input Stage:** The user provides a target URL (or batch of URLs) via the React frontend.
2. **Controller/Scanner:** The request is relayed via RESTful endpoints to the Python backend, which initiates the security parsing logic.
3. **Risk Analysis:** The backend engine checks headers, TLS configurations, and threat signature endpoints, applying a weighted algorithm to assign the final Risk Class.
4. **Storage:** The data payload is logged securely into the backend's persistent history layer.
5. **Visualization:** Evaluated payload is beamed back to the React UI. Data aggregates are structurally mapped through Chart.js components, culminating in the final interactive visualization.

## 5. Prerequisites

Before setting up the project locally, ensure you have the following installed:

* **Node.js:** (v16.x or strictly higher) & **npm**
* **Python:** (v3.9 or higher)
* **Browser:** A modern web browser (Chrome, Firefox, or Edge)
* **Git:** For version control operations.
* **Package Managers:** `pip` for Python and `npm` for frontend dependencies.

## 6. Installation & Setup (Step-by-Step)

Follow these instructions to get the tool running on your local machine:

**Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/web-vulnerability-scanner.git
cd web-vulnerability-scanner
```

**Step 2: Setup the Backend Environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

**Step 3: Run the Backend Server**
```bash
python app.py  # Or 'flask run' / 'uvicorn main:app --reload'
```
*The backend server should now be running on `http://localhost:5000` (or `8000`).*

**Step 4: Setup the Frontend Environment**
Open a new terminal window.
```bash
cd ../frontend
npm install
```

**Step 5: Configure Environment Variables**
Create a `.env` file in the `frontend` directory (if required) to map to your backend URL:
```env
VITE_API_URL=http://localhost:5000/api
```

**Step 6: Run the Frontend**
```bash
npm run dev
```

**Step 7: Launch**
Navigate to `http://localhost:5173` (or the supplied localhost port) in your web browser.

## 7. How It Works (Core Logic)

* **URL Parsing:** Input parameters are sanitized and domain structures are extracted.
* **Risk Logic Algorithm:** Background routines perform asynchronous requests to ping the target website. Based on a cascading series of rules—missing security headers (HSTS, X-Frame-Options), invalid SSL certificates, or flagged malware signatures—a point system operates.
* **Classification Rule:** 
  * Points < X = **Low Risk**
  * Points > X but < Y = **Medium Risk**
  * Points > Y = **High Risk**
* **Persistent Storage:** Once parsed, JSON structures containing `{ url: "...", timestamp: "...", risk: "..." }` are appended to an internal system ledger, avoiding the deletion of previous artifacts.
* **Graph Plotting:** The frontend fetches array blocks from the storage ledger. Risk variables are isolated, fed into the coordinate rendering function, and painted onto an XY-axis map dynamically.

## 8. Usage Guide

1. **Dashboard Initialization:** Open the main application web page.
2. **Execute Scan:** In the central input component, type a desired address (e.g., `http://example.com`) and click **"Run Scan"**.
3. **Wait for Results:** A loading state will display while backend routines actively parse the website.
4. **View Graph:** Navigate to the Analytics/Results Dashboard to view the newly updated risk distribution bar graph.
5. **Inspect the Data:** Hover directly over the **Red (High)**, **Yellow (Medium)**, or **Green (Low)** bar columns. A tooltip modal will appear enumerating the exact URLs associated with that specific risk level.
6. **Review History:** Click on the "History" tab to see chronological logs of all past scans.

## 9. Folder Structure

```text
CISS/
├── backend/
│   ├── app.py             # Main Python routing and server instantiation
│   ├── risk.py            # Subprocess risk logic for security assessments
│   └── requirements.txt   # Python dependencies mapping
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/    # Reusable UI parts (Graphs, NavBars)
│       ├── pages/         # Primary views (Results.jsx, History.jsx)
│       ├── App.jsx        # Routing configuration
│       └── main.jsx       # DOM mount logic
└── README.md
```

## 10. Sample Input & Output

**Example Input:**
> `http://old-unsecured-site.com`
> `https://google.com`

**Example Output Data:**
```json
[
  {
    "url": "http://old-unsecured-site.com",
    "riskLevel": "High",
    "findings": ["No SSL Configured", "Missing HSTS Header"]
  },
  {
    "url": "https://google.com",
    "riskLevel": "Low",
    "findings": ["Strict Transport Security verified"]
  }
]
```

**Graph Output:**
The graph visualizes '1' in the Low column and '1' in the High column based on the specific batch scan above.

## 11. Output Visualization Section

*Sample placeholder visuals of the application interface:*

![Dashboard View](assets/dashboard.png)  
*(Above: The main interface showing the dynamic bar chart tracking risks)*

![Graph Hover Capability](assets/graph.png)  
*(Above: Hover interaction revealing targeted URL metrics upon mouseover)*

## 12. Security Considerations

* **Limitations:** This scanner checks for generalized web configurations and public-facing security headers. It does not perform invasive penetration testing (no SQL injection mapping, payload dropping, or brute-forcing).
* **Safe Operations:** All scanning utilizes passive or quasi-passive request mechanisms preventing DOS (Denial of Service) accidents on target applications.
* **Disclaimer:** This tool serves strictly as a developmental/hackathon prototype. It is **not** a replacement for full-fledged enterprise solutions like Tenable Nessus, Burp Suite, or Qualys.

## 13. Challenges Faced

* **Asynchronous Bottlenecks:** Successfully handling multiple URLs concurrently without timing out the UI was difficult. Implemented threaded processing to prevent blockages.
* **Data State Overwrites:** Initially, history tracking kept resetting upon each trigger. Solved through an append-only JSON serialization function.
* **UI Visualization Precision:** Displaying multiple URLs neatly within a single hover-tooltip proved cumbersome for large arrays. Addressed this using scrollable constrained boxes within chart hover-widgets.

## 14. Future Enhancements

* **Browser Extension Pipeline:** Integrate directly as a Chrome Extension to actively catch and warn users before loading malicious portals.
* **AI Integration:** Implement LLM inference to intelligently describe unknown web anomalies or summarize complex threat vectors for junior analysts.
* **Enhanced Real-Time Alerts:** Push notifications built with WebSocket integration to alert users instantly upon detecting critical threshold vulnerabilities.
* **Auth System:** Include user authentication to sandbox separate history states per analyst.

## 15. Contributors

* **Hackathon Team Members**

## 16. License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
