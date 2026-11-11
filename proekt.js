let дестинации = [
    { id: 1, име: "Париз", цена: 1200, категорија: "Град" },
    { id: 2, име: "Рим", цена: 900, категорија: "Град" },
    { id: 3, име: "Барселона", цена: 1100, категорија: "Море" }
];
const популарниДестинации = [
    { име: "Париз", слика: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80" },
    { име: "Барселона", слика: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80" },
    { име: "Рим", слика: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80" },
    { име: "Мадрид", слика: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80" },
    { име: "Берлин", слика: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80" },
    { име: "Лондон", слика: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
    { име: "Стокхолм", слика: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=600&q=80" },
    { име: "Виена", слика: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80" },
    { име: "Лисабон", слика: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80" }
];
let состојбаСлики = {};
function случаенБрој() {
    return Math.floor(Math.random() * 101);
}
function прикажиТабелаДестинации() {
    const табела = document.getElementById('табела-дестинации');
    const буџет = parseInt(document.getElementById('филтер-буџет').value);
    document.getElementById('приказ-буџет').innerText = буџет + " €";
    табела.innerHTML = '';
    let вкупно = 0;
    const филтрирани = дестинации.filter(г => г.цена <= буџет);
    филтрирани.forEach(град => {
        вкупно += град.цена;
        табела.innerHTML += `
            <tr>
                <td>${град.име}</td>
                <td>${град.цена} €</td>
                <td><span class="badge badge-info">${град.категорија}</span></td>
                <td><button class="btn btn-sm btn-danger" onclick="избришиДестинација(${град.id})"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;
    });
    document.getElementById('вкупни-трошоци').innerText = вкупно + " €";
}
function додајДестинација(настан) {
    настан.preventDefault();
    const име = document.getElementById('внес-име').value;
    const цена = parseInt(document.getElementById('внес-цена').value);
    const категорија = document.getElementById('внес-категорија').value;
    const новId = дестинации.length > 0 ? Math.max(...дестинации.map(д => д.id)) + 1 : 1;
    дестинации.push({ id: новId, име: име, цена: цена, категорија: категорија });
    document.getElementById('форма-дестинација').reset();
    прикажиТабелаДестинации();
}
function избришиДестинација(id) {
    if(confirm("Дали сте сигурни дека сакате да ја избришете оваа дестинација?")) {
        дестинации = дестинации.filter(г => г.id !== id);
        прикажиТабелаДестинации();
    }
}
function филтрирајДестинации() {
    прикажиТабелаДестинации();
}
function вчитајГалерија() {
    const контејнер = document.getElementById('контејнер-галерија');
    контејнер.innerHTML = '';
    популарниДестинации.forEach(град => {
        const сликаID = град.име;
        if (!состојбаСлики[сликаID]) {
            состојбаСлики[сликаID] = { 
                лајкови: случаенБрој(), 
                дислајкови: случаенБрој(), 
                коментари: [],
                корисникГласал: false 
            };
        }
        контејнер.innerHTML += `
            <div class="col-md-4">
                <div class="галерија-картичка">
                    <img src="${град.слика}" class="галерија-слика-нова" alt="${град.име}">
                    <div class="галерија-контроли">
                        <h5 class="text-center mb-2">${град.име}</h5>
                        <div class="d-flex justify-content-between mb-2">
                            <button id="btn-лајк-${сликаID}" class="btn btn-sm btn-outline-primary" onclick="лајкСлика('${сликаID}')">👍 Like (<span id="лајк-${сликаID}">${состојбаСлики[сликаID].лајкови}</span>)</button>
                            <button id="btn-дислајк-${сликаID}" class="btn btn-sm btn-outline-danger" onclick="дислајкСлика('${сликаID}')">👎 Dislike (<span id="дислајк-${сликаID}">${состојбаСлики[сликаID].дислајкови}</span>)</button>
                        </div>
                        <div class="input-group input-group-sm mb-2">
                            <input type="text" class="form-control" id="внес-${сликаID}" placeholder="Коментар...">
                            <div class="input-group-append">
                                <button class="btn btn-secondary" onclick="додајКоментар('${сликаID}')">Испрати</button>
                            </div>
                        </div>
                        <ul class="галерија-коментари-листа" id="листа-${сликаID}">
                        </ul>
                    </div>
                </div>
            </div>
        `;
    });
}
function лајкСлика(сликаID) {
    if (состојбаСлики[сликаID].корисникГласал) return;
    состојбаСлики[сликаID].лајкови++;
    document.getElementById(`лајк-${сликаID}`).innerText = состојбаСлики[сликаID].лајкови;
    const копчеЛајк = document.getElementById(`btn-лајк-${сликаID}`);
    копчеЛајк.classList.remove('btn-outline-primary');
    копчеЛајк.classList.add('btn-primary');
    const копчеДислајк = document.getElementById(`btn-дислајк-${сликаID}`);
    копчеДислајк.classList.add('btn-избледено');
    документОневозможиГласање(сликаID);
}
function дислајкСлика(сликаID) {
    if (состојбаСлики[сликаID].корисникГласал) return;
    состојбаСлики[сликаID].дислајкови++;
    document.getElementById(`дислајк-${сликаID}`).innerText = состојбаСлики[сликаID].дислајкови;
    const копчеДислајк = document.getElementById(`btn-дислајк-${сликаID}`);
    копчеДислајк.classList.remove('btn-outline-danger');
    копчеДислајк.classList.add('btn-danger');
    const копчеЛајк = document.getElementById(`btn-лајк-${сликаID}`);
    копчеЛајк.classList.add('btn-избледено');
    документОневозможиГласање(сликаID);
}
function документОневозможиГласање(сликаID) {
    состојбаСлики[сликаID].корисникГласал = true;
    document.getElementById(`btn-лајк-${сликаID}`).disabled = true;
    document.getElementById(`btn-дислајк-${сликаID}`).disabled = true;
}
function додајКоментар(сликаID) {
    const внес = document.getElementById(`внес-${сликаID}`).value.trim();
    if(внес === "") return;
    состојбаСлики[сликаID].коментари.push(внес);
    document.getElementById(`внес-${сликаID}`).value = '';
    const листа = document.getElementById(`листа-${сликаID}`);
    листа.innerHTML = '';
    состојбаСлики[сликаID].коментари.forEach(к => {
        листа.innerHTML += `<li>${к}</li>`;
    });
    листа.scrollTop = листа.scrollHeight;
}
function прочитајПовеќе(град) {
    alert("Ова е демо верзија. Целата статија за " + град + " ќе биде достапна наскоро!");
}
function испратиАнкета(настан) {
    настан.preventDefault();
    const импресија = document.getElementById('анкета-импресија').value;
    const порака = document.getElementById('порака-анкета');
    порака.innerHTML = `<div class="alert alert-success">Ви благодариме! Вашата импресија (<strong>${импресија}</strong>) е успешно испратена.</div>`;
    document.getElementById('форма-анкета').reset();
}
document.addEventListener("DOMContentLoaded", function() {
    прикажиТабелаДестинации();
    вчитајГалерија();
});