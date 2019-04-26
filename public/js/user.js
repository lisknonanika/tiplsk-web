const withdraw = async() => {
    document.querySelector('.container').style = "visibility: hidden;";

    // 入力
    const inputResult = await Swal.fire({
        title: '以下を入力してください。',
        type: 'info',
        html: '<div><input type="text" id="text-address" placeholder="Lisk Address"></div>' +
              '<div id="field-amount"><input type="text" id="text-amount" placeholder="amount"><div></div></div>' +
              '<div id="field-note">*手数料0.1LSKは含めないで下さい。</div>',
        showCancelButton: true,
        preConfirm: () => {
            const address = document.querySelector('#text-address').value;
            const amount = document.querySelector('#text-amount').value;
            if (!address || !amount || !isLiskAddress(address) || !isAmount(amount)) {
                Swal.showValidationMessage(`入力に誤りがあります。`);
            }
        }
    });
    if (!inputResult || !inputResult.value) {
        document.querySelector('.container').style = "";
        return;
    }

    // 確認
    const address = document.querySelector('#text-address').value;
    const amount = document.querySelector('#text-amount').value;
    const confirmResult = await Swal.fire({
        title: '入力内容を確認してください。',
        type: 'warning',
        html: `<div class="text-left">Lisk Address:</div>` +
              `<div class="text-left conf-value"><a href="https://explorer.lisk.io/address/${address}" target="_blank">${address}</a></div>` +
              `<div class="text-left">Amount:</div>` +
              `<div class="text-left conf-value">${amount} LSK</div>`,
        showCancelButton: true
    });
    if (!confirmResult || !confirmResult.value) {
        document.querySelector('.container').style = "";
        return;
    }

    // 送金処理
    const params = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({liskAddress: address, amount: amount})
    }
    const res = await fetch(`./withdraw`, params);
    const json = await res.json();
    
    // エラーメッセージ設定
    let errMsg = '';
    if (isEmpty(json) || !json.result) errMsg = '何度も発生する場合は管理者にご連絡下さい。';
    else if (json.resultType === 1) errMsg = '残高が足りなかったみたいです。';
    else if (json.resultType === 2) errMsg = 'Liskのトランザクション生成に失敗しました。';
    
    if (!errMsg) {
        await Swal.fire({
            title: '送金しました。',
            type: 'success',
            html: `<div class="text-left">Transaction Id:</div>` +
                  `<div class="text-left conf-value"><a href="https://explorer.lisk.io/tx/${json.id}" target="_blank">${json.id}</a></div>` +
                  `<div class="text-left">Fee:</div>` +
                  `<div class="text-left conf-value">${json.fee} LSK</div>`,
        });
        location.href = './user';
    }  else {
        await Swal.fire({
            title: 'エラーが発生しました。',
            type: 'error',
            text: errMsg
        });
        document.querySelector('.container').style = "";
    }
}

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