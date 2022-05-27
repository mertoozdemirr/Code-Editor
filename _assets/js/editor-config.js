document.querySelector('#run').addEventListener('click', () => {
    buildOutput(false);
});
document.querySelector('#save').addEventListener('click', () => {
    saveData();
});

document.querySelector('#template-select').addEventListener('change', (el, index) => {

    const select = document.getElementById('template-select');
    const historyList = JSON.parse(localStorage.getItem("historyList"));
    const optionIndex = historyList[select.selectedIndex - 1];
    if (select.selectedIndex != 0) {
        const option = document.createElement("option");
        option.text = optionIndex.historyOption;
        buildOutput(true, optionIndex);
    }

});

document.querySelector('#minimize-btn').addEventListener('click', () => {
    if (document.querySelector('.window-box.active') != null) {
        document.querySelector('.window-box').classList.remove('active');
        document.querySelector('.preview').classList.remove('active');
    } else {
        document.querySelector('.window-box').classList.add('active');
        document.querySelector('.preview').classList.add('active');
    }
});

const buildOutput = (historyTemplate, data) => {
    let content = "";
    if (historyTemplate != true) {
        content = {
            html: htmlField.getValue(),
            style: cssField.getValue(),
            js: jsField.getValue()
        };
    } else {
        content = {
            html: data.historyHtml,
            style: data.historyCss,
            js: data.historyJs
        };

        htmlField.setValue(content.html);
        htmlField.clearSelection();

        cssField.setValue(content.style);
        cssField.clearSelection();

        jsField.setValue(content.js);
        jsField.clearSelection();
    }


    document.getElementById('iframe').contentWindow.document.querySelector('html').innerHTML = '<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '<meta charset="UTF-8">\n' +
        '<style type="text/css">\n' +
        content.style +
        '\n</style>\n' +
        '</head>\n' +
        '<body>\n' +
        content.html +
        '\n<script src="/_assets/js/editor/console.min.js"></script>\n' +
        '\n<script type="text/javascript">\n' +
        content.js +
        '\n</script>\n' +
        '</body>\n' +
        '</html>';
}

let historyArray = []
if (JSON.parse(localStorage.getItem("historyList")) != null)
    historyArray = JSON.parse(localStorage.getItem("historyList"));

const saveData = () => {
    if (document.getElementById('template-input').value.length > 0) {
        const store = {
            html: htmlField.getValue(),
            css: cssField.getValue(),
            js: jsField.getValue()
        };
        localStorage.setItem("cloudEdit", JSON.stringify(store));

        const option = document.createElement("option");
        option.text = document.getElementById('template-input').value;
        document.getElementById('template-select').add(option);

        var historyHtml = {
            historyOption: option.text,
            historyHtml: store.html,
            historyCss: store.css,
            historyJs: store.js
        }
        historyArray.push(historyHtml);
        localStorage.setItem('historyList', JSON.stringify(historyArray));


        $('#templateModal').modal('hide');

    }
}

const historySelect = () => {
    const historyList = JSON.parse(localStorage.getItem("historyList"));
    if (historyList != null) {
        historyList.map((el) => {
            const option = document.createElement("option");
            option.text = el.historyOption;
            document.getElementById('template-select').add(option);
        });
    }
}


historySelect();


window.onbeforeunload = function (e) {
    sessionStorage.setItem("html", htmlField.getValue());
    sessionStorage.setItem("css", cssField.getValue());
    sessionStorage.setItem("js", jsField.getValue());
};
