var help = false,
    nighttime = false;

window.onload = function () {
    window.addEventListener('keydown', checkKey);
    document.getElementById("paper").focus();
    checkNighttime();
}

function checkNighttime() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var date = new Date();
            var times = SunCalc.getTimes(date, position.coords.latitude, position.coords.longitude);
            if (date.getHours() >= times.sunset.getHours() | date.getHours() <= times.sunrise.getHours()) {
                setNighttime();
            }
        }, function (msg) {
            window.alert("There was an error, browser responded with this:", msg);
        });
    } else {
        window.alert("Geolocation not supported, sorry.");
    }
}

function checkKey(e) {
    var key = e.keyCode;
    if (key == 72 && e.ctrlKey) {}
    if (key == 72 && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        if (help) {
            hideHelp();
        } else if (!help) {
            showHelp();
        }
    }
    if (key == 79 && e.ctrlKey) {
        e.preventDefault();
        openFile();
    }
    if (key == 82 && e.ctrlKey) {
        e.preventDefault();
        window.location.reload();
    }
    if (key == 68 && e.ctrlKey) {
        e.preventDefault();
        showDownload();
    }
    if (key == 78 && e.ctrlKey && e.altKey) {
        e.preventDefault();
        if (nighttime) {
            setDaytime();
        } else if (!nighttime) {
            setNighttime();
        }
    }
    if (key == 80 && e.ctrlKey && e.altKey) {
      previewMarkdown();
    }
}

function showHelp() {
    help = true;
    var dialog = document.getElementById("help-dialog");
    dialog.style.transform = 'scale(1)';
}

function hideHelp() {
    help = false;
    var dialog = document.getElementById("help-dialog");
    dialog.style.transform = 'scale(0)';
}

function showDownload() {
    document.getElementById('download-dialog').style.transform = 'scale(1)';
}

function hideDownload() {
    document.getElementById('download-dialog').style.transform = 'scale(0)';
}

function openFile() {
    var input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.addEventListener('change', readFile, false)
}

function readFile(evt) {
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function () {
        document.getElementById('paper').innerHTML = this.result.replace(/\n/g, '<br>');
    }
    reader.readAsText(file);
}

function verifyDownloadInput(el) {
    var filename = el.parentElement.children[3].children[1].value,
        fileExtension = el.parentElement.children[3].children[6].value;
    if (filename != "" && fileExtension != "") {
        downloadFile(filename, fileExtension);
    } else {
        window.alert('There was an error when attempting to download your file, sorry.');
    }
}

function paper2Markdown() {
    var elHtml = document.getElementById("paper").innerHTML;
    elHtml = elHtml.replace(/<div><br><\/div>/g, '\n');
    elHtml = elHtml.replace(/(<div>)/g, '\n');
    elHtml = elHtml.replace(/(<\/div>)/g, '');
    return elHtml;
}

function downloadFile(filename, fileExtension) {
    var md = paper2Markdown();
    var link = document.createElement('a');
    mimeType = 'text/plain';
    link.setAttribute('download', filename + "." + fileExtension);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(md));
    link.click();
}

function setDaytime() {
    nighttime = false;
    document.body.style.backgroundColor = '#EFEBE9';
    document.body.style.color = '#363636';
    document.getElementById('paper').style.backgroundColor = '#EFEBE9';
    document.getElementById('paper').style.color = '#363636';
    var borders = document.querySelectorAll('.border');
    for (var i = 0; i < borders.length; i++) {
        borders[i].style.backgroundColor = '#EFEBE9';
    };
    document.getElementById('help').style.backgroundColor = '#363636';
    document.getElementById('help').style.color = '#EFEBE9';
    document.getElementById('help-dialog').style.backgroundColor = 'rgba(56, 56, 56, .8)';
    document.getElementById('help-dialog').style.color = '#EFEBE9';
    document.getElementById('download-dialog').style.backgroundColor = "rgba(56, 56, 56, .8)";
    document.getElementById('download-dialog').style.color = '#EFEBE9';
    document.getElementById('filename').style.backgroundColor = "rgba(239, 235, 233, .8)";
    document.getElementById('filename').style.color = "#363636";
    document.getElementById('file-extension').style.backgroundColor = "rgba(239, 235, 233, .8)";
    document.getElementById('file-extension').style.color = "#363636";
    document.getElementById('download-button').style.backgroundColor = 'rgba(239, 235, 233, .8)';
    document.getElementById('download-button').style.color = '#363636';
    document.getElementById('preview').style.backgroundColor = '#EFEBE9';
    document.getElementById('preview').style.color = '#363636';
}

function setNighttime() {
    nighttime = true;
    document.body.style.backgroundColor = '#363636';
    document.body.style.color = '#EFEBE9';
    document.getElementById('paper').style.backgroundColor = '#363636';
    document.getElementById('paper').style.color = '#EFEBE9';
    var borders = document.querySelectorAll('.border');
    for (var i = 0; i < borders.length; i++) {
        borders[i].style.backgroundColor = '#363636';
    };
    document.getElementById('help').style.backgroundColor = '#EFEBE9';
    document.getElementById('help').style.color = '#363636';
    document.getElementById('help-dialog').style.backgroundColor = 'rgba(239, 235, 233, .8)';
    document.getElementById('help-dialog').style.color = '#363636';
    document.getElementById('download-dialog').style.backgroundColor = "rgba(239, 235, 233, .8)";
    document.getElementById('download-dialog').style.color = '#363636';
    document.getElementById('filename').style.backgroundColor = "rgba(56, 56, 56, .8)";
    document.getElementById('filename').style.color = "#EFEBE9";
    document.getElementById('file-extension').style.backgroundColor = "rgba(56, 56, 56, .8)";
    document.getElementById('file-extension').style.color = "#EFEBE9";
    document.getElementById('download-button').style.backgroundColor = 'rgba(56, 56, 56, .8)';
    document.getElementById('download-button').style.color = '#EFEBE9';
    document.getElementById('preview').style.backgroundColor = '#EFEBE9';
    document.getElementById('preview').style.color = '#363636';
}

function previewMarkdown() {
    var preview = document.getElementById('preview');
    if (!(preview.style.top == 0 | preview.style.top == '0' | preview.style.top == '0px')) {
        preview.children[0].innerHTML = marked(paper2Markdown());
        preview.style.top = 0;
        preview.style.transform = 'scale(1)';
    } else if (!(preview.style.top == '100%')) {
      preview.style.top = '100%';
      preview.style.transform = 'scale(.85)';
    }
}