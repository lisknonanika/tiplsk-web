const withdraw = async() => {
    document.querySelector('.container').style = "visibility: hidden;";

    // 入力
    const inputResult = await Swal.fire({
        title: '以下を入力してください。',
        type: 'info',
        html: '<div id="field-address"><input type="text" id="text-address" placeholder="Lisk Address"></div>' +
              '<div id="field-amount"><input type="text" id="text-amount" placeholder="amount"><div></div></div>' +
              '<div id="field-note">*手数料0.1LSKは含めないで下さい。</div>',
        showCancelButton: true,
        preConfirm: () => {
            const address = document.querySelector('#text-address').value;
            const amount = document.querySelector('#text-amount').value;
            if (!address || !amount || !isLiskAddress(address) || !isAmount(amount)) {
                Swal.showValidationMessage(`入力に誤りがあります。`)
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

    (async() => {
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
    })();
}