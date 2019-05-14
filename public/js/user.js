const validpw = (pw) => {
    return new RegExp(/(^[0-9a-zA-Z\-_@=+!]{8,}$)/).test(pw);
}

const changepw = async() => {
    document.querySelector('.container').style = "visibility: hidden;";

    // 入力
    const inputResult = await Swal.fire({
        title: '新しいパスワードを入力してください。',
        type: 'info',
        html: '<div id="field-pw"><input type="password" id="text-pw" placeholder="Password"></div>' +
              '<div><button id="btn-pw" class="btn btn-info">パスワードを表示</button></div>' +
              '<div id="field-note">*半角英数字と記号(-_@=+!)が使用出来ます。</div>',
        showCancelButton: true,
        onBeforeOpen: () => {
            let isMask = true;
            document.querySelector("#btn-pw").addEventListener("click", () => {
                if (isMask) {
                    document.querySelector("#text-pw").type="text";
                    document.querySelector("#btn-pw").innerHTML = "パスワードを隠す"
                    isMask = false;
                } else {
                    document.querySelector("#text-pw").type="password";
                    document.querySelector("#btn-pw").innerHTML = "パスワードを表示"
                    isMask = true;
                }
            });
        },
        preConfirm: () => {
            const pw = document.querySelector("#text-pw").value;
            if (!pw || !validpw(pw)) {
                Swal.showValidationMessage(`入力に誤りがあります。`);
            }
        }
    });
    if (!inputResult || !inputResult.value) {
        document.querySelector('.container').style = "";
        return;
    }

    // 送金処理
    const pw = document.querySelector("#text-pw").value;
    const params = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({pw: pw})
    }
    const res = await fetch(`./password`, params);
    const json = await res.json();
    
    if (!isEmpty(json) && json.result) {
        await Swal.fire({
            title: 'パスワードを変更しました。',
            type: 'success',
            html: `<div>次回から新しいパスワードでログインしてください。</div>`
        });
        document.querySelector('.container').style = "";
    }  else {
        await Swal.fire({
            title: 'エラーが発生しました。',
            type: 'error',
            text: '何度も発生する場合は管理者にご連絡下さい。'
        });
        document.querySelector('.container').style = "";
    }
}
