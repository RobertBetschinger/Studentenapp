document.addEventListener("deviceready", onDeviceReady, true);

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, true);
}

function onDeviceReady() {
    // navigator.notification.alert("PhoneGap is working");
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
}

function callMainMenu() {
    window.location = "index.html";
}

function onOffline() {
    alert("Keine Internetverbindung! App nur eingeschränkt verwendungsfähig.");
}

function onOnline() {
    alert("Internetverbindung wieder vorhanden.");
}

function callLernenPage() {
    window.location = "lernen.html"
}

function callIndex() {
    window.location = "index.html";
}

function callPruefungPage() {
    window.location = "pruefung_quiz.html";
}

function callStudentsPerformancePage() {
    window.location = "studentPerformance.html";
}

function callUsageOverviewPage() {
    window.location = "usage_overview_page.html";
}