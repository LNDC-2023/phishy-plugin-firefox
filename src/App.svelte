<script lang="ts">
    // @ts-ignore
    import browser from "webextension-polyfill";
    import "./app.css"

    interface InjectorData {
        mail: string | undefined,
        content: string | undefined
    }

    let mailAddress: string = "";
    let mailContent: string = "";

    browser.storage.local.get().then((data: InjectorData) => {
        data.mail && (mailAddress = data.mail)
        data.content && (mailContent = data.content)
        console.log(data.content?.trim())
    })
</script>

<main>
    <div class="w-72 h-72">
        Mail from
        <span class="text-blue-500">
            {mailAddress.slice(1, mailAddress.length - 1)}
        </span>
        <br/>
        {mailContent.trim()}
        <br/>
        That seems phishy!
    </div>
</main>