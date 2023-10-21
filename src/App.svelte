<script lang="ts">
    // @ts-ignore
    import browser from "webextension-polyfill";
    import "./app.css"
    import Spacer from "./lib/Spacer.svelte";

    enum Status {
        NODATA,
        HARMLESS,
        DANGEROUS
    }

    interface InjectorData {
        mail: string,
        content: string,
        phishing_status: string,
        mail_status: string
    }

    let mailAddress: string = "";
    let mailContent: string = "";
    let phishingStatus: Status = Status.NODATA;
    let mailStatus: Status = Status.NODATA;

    browser.storage.local.get().then(async (data: InjectorData) => {
            mailAddress = data.mail
            mailContent = data.content
            switch (data.mail_status) {
                case "DANGEROUS": mailStatus = Status.DANGEROUS; break;
                case "HARMLESS": mailStatus = Status.HARMLESS; break;
                case "NODATA": mailStatus = Status.NODATA; break;
            }
            switch (data.phishing_status) {
                case "DANGEROUS": phishingStatus = Status.DANGEROUS; break;
                case "HARMLESS": phishingStatus = Status.HARMLESS; break;
                case "NODATA": phishingStatus = Status.NODATA; break;
            }

            console.log(phishingStatus + " " + mailStatus)
    })
</script>

<main class="p-2 text-gray-100 bg-gray-100">
    {#if ((mailStatus == Status.DANGEROUS) || (phishingStatus == Status.DANGEROUS))}
        <div class="w-96 min-h-96 bg-red-600 rounded p-4">
            <p class="w-full text-center text-9xl">⚠</p>
            <p class="text-3xl font-bold text-center">That seems a li'l phishy!</p>
            <Spacer/>
            <p class="text-xl font-bold">How to recognize phishing?</p>
            <ol class="list-decimal pl-[1.5em] mx-1">
                <li>Grammar mistakes</li>
                <li>Written in a strange language</li>
                <li>Your name is missing in the form of address</li>
                <li>Seemingly urgent need for action</li>
                <li>They're asking for personal data</li>
                <li>They want to make you open a file</li>
                <li>They want to make you open a link</li>
                <li>You never received an email from that bank before or you're not a customer</li>
                <li>Check if the sender is reliable</li>
            </ol>
            <Spacer/>
            <button class="border rounded border-solid border-1 border-gray-100 h-10 w-full">Report wrong detection</button>
        </div>
    {:else if ((mailStatus == Status.HARMLESS) && (phishingStatus == Status.HARMLESS))}
        <div class="w-96 min-h-96 bg-green-600 rounded p-4">
            <p class="w-full text-center text-9xl">✓</p>
            <p class="text-3xl font-bold text-center">Should be safe!</p>
            <Spacer/>
            <button class="border rounded border-solid border-1 border-gray-100 h-10 w-full">Report phishing mail</button>
        </div>
    {:else if ((mailStatus == Status.NODATA) && (phishingStatus == Status.NODATA))}
        <div class="w-96 min-h-96 bg-gray-600 rounded p-4">
            <p class="w-full text-center text-9xl">∅</p>
            <Spacer/>
            <p class="text-3xl font-bold text-center">No data ...</p>
        </div>
    {/if}
</main>