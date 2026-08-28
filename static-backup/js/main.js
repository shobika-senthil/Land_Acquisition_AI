/* =========================================================
   LANDLYTICS
   MAIN DASHBOARD JAVASCRIPT
   Connects frontend with Flask backend
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();
    setupSidebar();

});


/* =========================================================
   API HELPER
   ========================================================= */

async function fetchAPI(endpoint) {

    const response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status}`
        );
    }

    return await response.json();

}


/* =========================================================
   LOAD DASHBOARD
   ========================================================= */

async function loadDashboard() {

    try {

        const data =
            await fetchAPI("/analytics/summary");

        if (!data.success) {

            throw new Error(
                "Dashboard API returned an unsuccessful response."
            );

        }

        updateDashboard(data);

        updateSystemStatus(data);

    }

    catch (error) {

        console.error(
            "LANDLYTICS dashboard error:",
            error
        );

        showDashboardError();

    }

}


/* =========================================================
   UPDATE DASHBOARD
   ========================================================= */

function updateDashboard(data) {

    setText(
        "totalProjects",
        formatNumber(data.total_projects)
    );

    setText(
        "highRiskProjects",
        formatNumber(data.high_risk_projects)
    );

    setText(
        "criticalProjects",
        formatNumber(data.critical_projects)
    );

    setText(
        "delayProbability",
        formatPercentage(
            data.average_delay_probability
        )
    );

    setText(
        "databaseStatus",
        "Connected"
    );

    setText(
        "modelStatus",
        "Loaded"
    );

    setText(
        "gisStatus",
        "Ready"
    );

    setText(
        "lastUpdated",
        new Date().toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        )
    );

}


/* =========================================================
   SYSTEM STATUS
   ========================================================= */

function updateSystemStatus(data) {

    const database =
        document.getElementById(
            "databaseStatus"
        );

    const model =
        document.getElementById(
            "modelStatus"
        );

    if (database) {

        database.classList.add(
            "status-connected"
        );

    }

    if (model) {

        model.classList.add(
            "status-connected"
        );

    }

}


/* =========================================================
   NUMBER FORMAT
   ========================================================= */

function formatNumber(value) {

    if (
        value === null ||
        value === undefined ||
        Number.isNaN(Number(value))
    ) {

        return "—";

    }

    return Number(value).toLocaleString(
        "en-IN"
    );

}


/* =========================================================
   PERCENTAGE FORMAT
   ========================================================= */

function formatPercentage(value) {

    if (
        value === null ||
        value === undefined ||
        Number.isNaN(Number(value))
    ) {

        return "—";

    }

    return `${Number(value).toFixed(1)}%`;

}


/* =========================================================
   SAFE TEXT UPDATE
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent = value;

}


/* =========================================================
   DASHBOARD ERROR
   ========================================================= */

function showDashboardError() {

    setText(
        "databaseStatus",
        "Connection Error"
    );

    setText(
        "modelStatus",
        "Unavailable"
    );

    setText(
        "gisStatus",
        "Unavailable"
    );

}


/* =========================================================
   SIDEBAR
   ========================================================= */

function setupSidebar() {

    const toggle =
        document.getElementById(
            "sidebarToggle"
        );

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    if (!toggle || !sidebar) {
        return;
    }

    toggle.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "sidebar-collapsed"
            );

        }
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setActiveNavigation() {

    const currentPath =
        window.location.pathname;

    const navigationItems =
        document.querySelectorAll(
            ".navigation-item"
        );

    navigationItems.forEach(item => {

        const href =
            item.getAttribute("href");

        if (
            href &&
            href === currentPath
        ) {

            item.classList.add(
                "active"
            );

        }
        else {

            item.classList.remove(
                "active"
            );

        }

    });

}


setActiveNavigation();