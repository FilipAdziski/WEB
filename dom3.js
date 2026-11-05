var vozaci = [
    { id: 1, ime: "Michael Schumacher", tim: "Ferrari", baseSpeed: 95, baseSkill: 98, gumi: "SOFT", totalTime: 0, status: "Подготвен", pit: false },
    { id: 2, ime: "Niki Lauda", tim: "Ferrari", baseSpeed: 93, baseSkill: 97, gumi: "SOFT", totalTime: 0, status: "Подготвен", pit: false },
    { id: 3, ime: "Max Verstappen", tim: "Red Bull", baseSpeed: 94, baseSkill: 98, gumi: "SOFT", totalTime: 0, status: "Подготвен", pit: false },
    { id: 4, ime: "Sebastian Vettel", tim: "Red Bull", baseSpeed: 92, baseSkill: 96, gumi: "HARD", totalTime: 0, status: "Подготвен", pit: false },
    { id: 5, ime: "Lewis Hamilton", tim: "Mercedes", baseSpeed: 93, baseSkill: 97, gumi: "HARD", totalTime: 0, status: "Подготвен", pit: false },
    { id: 6, ime: "Nico Rosberg", tim: "Mercedes", baseSpeed: 91, baseSkill: 91, gumi: "SOFT", totalTime: 0, status: "Подготвен", pit: false },
    { id: 7, ime: "Nigel Mansell", tim: "Williams", baseSpeed: 92, baseSkill: 89, gumi: "HARD", totalTime: 0, status: "Подготвен", pit: false },
    { id: 8, ime: "Carlos Sainz", tim: "Williams", baseSpeed: 91, baseSkill: 85, gumi: "SOFT", totalTime: 0, status: "Подготвен", pit: false },
    { id: 9, ime: "Pierre Gasly", tim: "Alpine", baseSpeed: 90, baseSkill: 74, gumi: "HARD", totalTime: 0, status: "Подготвен", pit: false },
    { id: 10, ime: "Franco Colapinto", tim: "Alpine", baseSpeed: 88, baseSkill: 70, gumi: "SOFT", totalTime: 0, status: "Подготвен", pit: false }
];

const tipGumi = {
    SOFT: { name: "Soft", speedBonus: 0.5, wearRate: 16 }, 
    HARD: { name: "Hard", speedBonus: 0.0, wearRate: 7 }   
};
const vkupnoKruga = 10;
let tekovenKrug = 0;
let trkaPocnata = false;

function renderTable() {
    const tbody = document.getElementById('tabelaBody');
    tbody.innerHTML = '';

    vozaci.sort((a, b) => {
        if (a.status.includes("Излегол")) return 1;
        if (b.status.includes("Излегол")) return -1;
        return a.totalTime - b.totalTime;
    });

    vozaci.forEach(driver => {
        const tr = document.createElement('tr');
        
        let statusClass = "";
        if (driver.status.includes("Пит-стоп")) statusClass = "status-pit";
        if (driver.status.includes("Излегол")) statusClass = "status-crash";
        if (driver.status.includes("Завршил")) statusClass = "status-finished";

        let tireWear = Math.min(100, Math.round(driver.tireWear)); 
        
        let tireColor = tireWear >= 80 ? "color: #f44336; font-weight: bold;" : "";

        tr.innerHTML = `
            <td>${driver.ime}</td>
            <td>${driver.tim}</td>
            <td style="${tireColor}">${driver.gumi} (${tireWear}%)</td>
            <td>${driver.totalTime.toFixed(2)}s</td>
            <td class="${statusClass}">${driver.status}</td>
        `;
        tbody.appendChild(tr);
    });
}

function handleButtonClick() {
    const btn = document.getElementById('pocetokButton');
    const statusDiv = document.getElementById('raceStatus');

    if (!trkaPocnata) {
        trkaPocnata = true;
        tekovenKrug = 1;
        
        vozaci.forEach(d => {
            d.totalTime = 0;
            d.status = "Возење";
            d.pit = false;
            d.tireWear = 0;
            d.gumi = Math.random() > 0.5 ? "SOFT" : "HARD"; 
        });
        
        document.getElementById('pobednik').style.display = 'none';
        statusDiv.innerText = `Во тек е круг 1 од ${vkupnoKruga}...`;
        btn.innerText = `Следен круг (${tekovenKrug + 1}/${vkupnoKruga})`;
        
        renderTable();
        return;
    }

    if (trkaPocnata && tekovenKrug < vkupnoKruga) {
        tekovenKrug++;
        btn.innerText = `Следен круг (${tekovenKrug}/${vkupnoKruga})`;
        if (tekovenKrug === vkupnoKruga) {
             btn.innerText = `Заврши трка`;
        }
        
        simulateLap();
        statusDiv.innerText = `Во тек е круг ${tekovenKrug} од ${vkupnoKruga}...`;
        renderTable();
    } 
    else if (tekovenKrug === vkupnoKruga && btn.innerText === "Заврши трка") {
        finishRace();
        btn.innerText = "Започни нова трка";
        trkaPocnata = false; 
        tekovenKrug = 0;
    }
}

function simulateLap() {
    vozaci.forEach(driver => {
        if (driver.status.includes("Излегол")) return;

        let lapTime = 100 - (driver.baseSpeed * 0.2) - (driver.baseSkill * 0.1);
        lapTime -= tipGumi[driver.gumi].speedBonus;
        lapTime += (Math.random() * 2 - 1); 

        let crashChance = Math.random() * 100;
        if (crashChance > (driver.baseSkill + 12)) { 
            driver.status = "Излегол од трка (Удар)";
            return; 
        }

        let wearIncrease = tipGumi[driver.gumi].wearRate + (Math.random() * 3);
        driver.tireWear += wearIncrease;

        lapTime += (driver.tireWear * 0.03);

        if (driver.tireWear >= 80) {
            driver.status = "Во Пит-стоп";
            lapTime += 15;
            
            driver.gumi = driver.gumi === "SOFT" ? "HARD" : "SOFT";
            driver.tireWear = 0;
            driver.pit = true;
        } else {
            driver.status = "Возење";
        }

        driver.totalTime += lapTime;
    });
}

function finishRace() {
    document.getElementById('raceStatus').innerText = "Трката заврши!";
    let winnerDiv = document.getElementById('pobednik');
    
    let finishedDrivers = vozaci.filter(d => !d.status.includes("Излегол"));
    
    if (finishedDrivers.length > 0) {
        finishedDrivers.sort((a, b) => a.totalTime - b.totalTime);
        let winner = finishedDrivers[0];
        
        vozaci.forEach(d => {
            if (!d.status.includes("Излегол")) {
                d.status = "Завршил";
            }
        });
        
        renderTable();
        
       
        alert(`ПОБЕДНИК!\n\n${winner.ime} (${winner.tim})\nВкупно време: ${winner.totalTime.toFixed(2)}s`);

    } else {
        alert(" Сите возачи излетаа! Оваа трка нема победник.");
    }
}

renderTable();