import browser from 'webextension-polyfill';

console.log('phishy injector loaded');

let prevMail = '';
let prevContent = '';
let mailStatus = 'NODATA';
let contentStatus = 'NODATA';
let dataDeleted = true;

const removeAlertBox = () => {
  document.getElementById('alertbox')?.remove();
};

const readData = async () => {
  await (async () => {
    if (document.getElementsByClassName('go').length == 0) {
      removeAlertBox();
      if (dataDeleted) return;
      browser.storage.local.set({
        mail: '',
        content: '',
        phishing_status: 'NODATA',
        mail_status: 'NODATA',
      });
      dataDeleted = true;
      console.log('content deleted');
      return;
    }
    dataDeleted = false;

    let mailBuffer = document.getElementsByClassName('go')[0].textContent;
    let mail = mailBuffer?.slice(1, mailBuffer.length - 1);
    let content = document.getElementsByClassName('ii gt')[0].textContent;

    if (mail == prevMail && content == prevContent) return;

    const rawResponse = await fetch(
      'https://lndc2023.lab.minomy13.de/email-body-classification',
      {
        method: 'POST',
        body: content,
        headers: {
          'Content-type': 'text/plain',
        },
        mode: 'cors',
      }
    );
    rawResponse.body
      ?.getReader()
      .read()
      .then(({ done, value }) => {
        let result = new TextDecoder('utf-8').decode(value);
        console.log('phishing: ' + result);
        if (result == 'Phishing Email') contentStatus = 'DANGEROUS';
        else if (result == 'Safe Email') contentStatus = 'HARMLESS';
        console.log('phishing-status: ' + contentStatus);
      });

    console.log('address: ' + mail);

    const rawLookalikeResponse = await fetch(
      'https://lndc2023.lab.minomy13.de/find-look-alikes',
      {
        method: 'POST',
        body: mail,
        headers: {
          'Content-type': 'text/plain',
        },
        mode: 'cors',
      }
    );
    rawLookalikeResponse.body
      ?.getReader()
      .read()
      .then(({ done, value }) => {
        let result = new TextDecoder('utf-8').decode(value);
        console.log('lookalikes: ' + result);
        if (result == 'true') mailStatus = 'DANGEROUS';
        else if (result == 'false') mailStatus = 'HARMLESS';
        console.log('lookalike-status: ' + mailStatus);
      });

    browser.storage.local.set({
      mail: mail,
      content: content,
      phishing_status: contentStatus,
      mail_status: mailStatus,
    });
    mail && (prevMail = mail);
    content && (prevContent = content);
    console.log('new content set');
  })();
};

const alertboxHandler = async () => {
  if (document.getElementsByClassName('go').length == 0) {
    removeAlertBox();
    return;
  }

  if (!document.getElementById('alertbox')) {
    if (contentStatus != 'DANGEROUS' && mailStatus != 'DANGEROUS') {
      removeAlertBox();
      return;
    }

    const alertbox = document.createElement('div');
    alertbox.style.width = '100%';
    alertbox.style.height = '60px';
    alertbox.style.backgroundColor = '#dc2626';
    alertbox.id = 'alertbox';
    alertbox.style.textAlign = 'center';
    alertbox.style.color = 'white';
    alertbox.style.padding = 'auto';
    alertbox.style.lineHeight = '60px';
    alertbox.textContent =
      '⚠     Attention! Mail might be dangerous. For further advice check your phishy plugin.';
    document.getElementsByClassName('nH ar4 z')[0].prepend(alertbox);
    console.log('appended child');
  }
};

const readDataCron = setInterval(async () => {
  await readData();
  await alertboxHandler();
}, 250);
