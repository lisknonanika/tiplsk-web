const withdraw = async() => {
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
            } else {
                return;
            }
        }
    });
    if (!inputResult || !inputResult.value) return;

    // 確認
    const address = document.querySelector('#text-address').value;
    const amount = document.querySelector('#text-amount').value;
    const confirmResult = await Swal.fire({
        title: '入力内容を確認してください。',
        type: 'warning',
        html: `<div class="text-left">Lisk Address:</div>` +
                `<div class="text-left conf-value">${address}</div>` +
                `<div class="text-left conf-value"><a href="https://explorer.lisk.io/address/${address}" target="_blank">*Lisk Explorerで確認</a></div>` +
                `<div class="text-left">Amount:</div>` +
                `<div class="text-left conf-value">${amount} LSK</div>`,
        showCancelButton: true
    });
    if (!confirmResult || !confirmResult.value) return;
}