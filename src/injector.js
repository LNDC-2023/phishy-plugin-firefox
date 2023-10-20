import browser from 'webextension-polyfill';

console.log('phishy injector loaded');

const readData = () => {
  browser.storage.local.set({
    mail: document.getElementsByClassName('go')[0]?.textContent,
    content: document.getElementsByClassName('ii gt')[0]?.textContent,
  });
};

const readDataCron = setInterval(readData, 1000);
