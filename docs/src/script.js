// Multilingual Dictionary (EN-US default, PT-BR, ES)
const i18n = {
    en: {
        title: "Educational Ransomware Simulator",
        desc: "Upload a .txt file to simulate encryption and decryption using AES-CTR mode.",
        chooseFile: "Choose File (.txt)",
        noFile: "No file selected",
        keyLabel: "Secret Key (16 chars):",
        encryptBtn: "Encrypt File",
        decryptBtn: "Decrypt File",
        inspectorLabel: "File Content Inspector:",
        footer: "Developed by Nivaldo Beirão",
        statusReady: "Status: Ready",
        statusLoaded: "Status: Loaded file: ",
        statusEncrypted: "Status: File encrypted! Original test.txt removed and test.txt.ransomwaretroll saved.",
        statusDecrypted: "Status: File decrypted! Ransomware file removed and test.txt restored."
    },
    pt: {
        title: "Simulador Educacional de Ransomware",
        desc: "Faça upload de um arquivo .txt para simular a criptografia e descriptografia usando AES-CTR.",
        chooseFile: "Escolher Arquivo (.txt)",
        noFile: "Nenhum arquivo selecionado",
        keyLabel: "Chave Secreta (16 chars):",
        encryptBtn: "Criptografar Arquivo",
        decryptBtn: "Descriptografar Arquivo",
        inspectorLabel: "Inspetor de Conteúdo do Arquivo:",
        footer: "Desenvolvido por Nivaldo Beirão",
        statusReady: "Status: Pronto",
        statusLoaded: "Status: Arquivo carregado: ",
        statusEncrypted: "Status: Arquivo criptografado! test.txt removido e test.txt.ransomwaretroll salvo.",
        statusDecrypted: "Status: Arquivo descriptografado! Arquivo criptografado removido e test.txt restaurado."
    },
    es: {
        title: "Simulador Educativo de Ransomware",
        desc: "Cargue un archivo .txt para simular la encriptación y desencriptación usando el modo AES-CTR.",
        chooseFile: "Seleccionar Archivo (.txt)",
        noFile: "Ningún archivo seleccionado",
        keyLabel: "Clave Secreta (16 chars):",
        encryptBtn: "Encriptar Archivo",
        decryptBtn: "Desencriptar Archivo",
        inspectorLabel: "Inspector de Contenido del Archivo:",
        footer: "Desarrollado por Nivaldo Beirão",
        statusReady: "Estado: Listo",
        statusLoaded: "Estado: Archivo cargado: ",
        statusEncrypted: "Estado: ¡Archivo encriptado! test.txt eliminado y test.txt.ransomwaretroll guardado.",
        statusDecrypted: "Estado: ¡Archivo desencriptado! Archivo encriptado eliminado y test.txt restaurado."
    }
};

let currentLang = "en";
let loadedFileContent = null;
let currentFileName = "";

// DOM Element Selectors
const htmlElem = document.documentElement;
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const langSelect = document.getElementById("lang-select");

const appTitle = document.getElementById("app-title");
const appDesc = document.getElementById("app-desc");
const fileLabel = document.getElementById("file-label");
const fileNameDisplay = document.getElementById("file-name");
const labelKey = document.getElementById("label-key");
const btnEncrypt = document.getElementById("btn-encrypt");
const btnDecrypt = document.getElementById("btn-decrypt");
const labelInspector = document.getElementById("label-inspector");
const fileInspector = document.getElementById("file-inspector");
const footerText = document.getElementById("footer-text");
const statusMsg = document.getElementById("status-message");

const fileInput = document.getElementById("file-input");
const keyInput = document.getElementById("key-input");

// Dark/Light Theme Switching
themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElem.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlElem.setAttribute("data-theme", newTheme);
    themeIcon.textContent = newTheme === "dark" ? "🌙" : "☀️";
});

// Language Switch Listener
langSelect.addEventListener("change", (e) => {
    currentLang = e.target.value;
    updateLanguage();
});

function updateLanguage() {
    const lang = i18n[currentLang];
    appTitle.textContent = lang.title;
    appDesc.textContent = lang.desc;
    fileLabel.textContent = lang.chooseFile;
    labelKey.textContent = lang.keyLabel;
    btnEncrypt.textContent = lang.encryptBtn;
    btnDecrypt.textContent = lang.decryptBtn;
    labelInspector.textContent = lang.inspectorLabel;
    footerText.textContent = lang.footer;

    if (!currentFileName) {
        fileNameDisplay.textContent = lang.noFile;
        statusMsg.textContent = lang.statusReady;
    }
}

// File Loading & Inspector Display Logic
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        currentFileName = file.name;
        fileNameDisplay.textContent = file.name;

        const reader = new FileReader();
        reader.onload = (event) => {
            loadedFileContent = event.target.result;
            fileInspector.value = loadedFileContent;
            statusMsg.textContent = i18n[currentLang].statusLoaded + file.name;

            // Enable appropriate buttons according to file extension
            if (file.name.endsWith(".ransomwaretroll")) {
                btnEncrypt.disabled = true;
                btnDecrypt.disabled = false;
            } else {
                btnEncrypt.disabled = false;
                btnDecrypt.disabled = false;
            }
        };
        reader.readAsText(file);
    }
});

// AES-CTR Encryption (Simulating encrypter.py)
btnEncrypt.addEventListener("click", () => {
    if (!loadedFileContent) return;

    const keyText = keyInput.value;
    const key = CryptoJS.enc.Utf8.parse(keyText);

    // Encrypt raw content using AES-CTR mode with zero initial vector (IV) matching Python pyaes
    const encrypted = CryptoJS.AES.encrypt(loadedFileContent, key, {
        mode: CryptoJS.mode.CTR,
        padding: CryptoJS.pad.NoPadding,
        iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")
    });

    // Convert ciphertext to Latin1/binary payload
    const encryptedContent = encrypted.ciphertext.toString(CryptoJS.enc.Latin1);

    // Display encrypted output in the Inspector
    fileInspector.value = encryptedContent;

    // Simulate removing test.txt and saving test.txt.ransomwaretroll
    downloadFile("test.txt.ransomwaretroll", encryptedContent);
    statusMsg.textContent = i18n[currentLang].statusEncrypted;
    
    // Update internal state to encrypted file
    loadedFileContent = encryptedContent;
    btnEncrypt.disabled = true;
    btnDecrypt.disabled = false;
});

// AES-CTR Decryption (Simulating decrypter.py)
btnDecrypt.addEventListener("click", () => {
    if (!loadedFileContent) return;

    const keyText = keyInput.value;
    const key = CryptoJS.enc.Utf8.parse(keyText);

    // Convert encrypted payload to CryptoJS CipherParams format
    const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Latin1.parse(loadedFileContent)
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        mode: CryptoJS.mode.CTR,
        padding: CryptoJS.pad.NoPadding,
        iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    // Display decrypted output in the Inspector
    fileInspector.value = decryptedText;

    // Simulate removing test.txt.ransomwaretroll and saving test.txt
    downloadFile("test.txt", decryptedText);
    statusMsg.textContent = i18n[currentLang].statusDecrypted;

    // Update internal state to decrypted file
    loadedFileContent = decryptedText;
    btnEncrypt.disabled = false;
    btnDecrypt.disabled = true;
});

// File Download Helper
function downloadFile(filename, textContent) {
    const element = document.createElement("a");
    const fileBlob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
