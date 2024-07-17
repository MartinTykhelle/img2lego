<script>
    import { onMount } from "svelte";
    import { tooltip } from "@svelte-plugins/tooltips";
    let data = [];
    let colors;
    onMount(async function () {
        const response = await fetch("/data/legoColors");
        data = await response.json();
        colors = data
            .filter((x) => x.enabled)
            .map((x) => x.colorCode)
            .join(",");
    });

    function colorClick(color) {
        color["enabled"] = !color["enabled"];
        data = data;
        colors = data
            .filter((x) => x.enabled)
            .map((x) => x.colorCode)
            .join(",");
    }

    function disableAll(){
        data.map(x=>x.enabled=false);
        data = data;
    }
</script>

{#each data as color}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="color"
        class:active={color.enabled}
        on:click={colorClick(color)}
        use:tooltip={{ content: color.name, position: "top" }}
        data-color-code={color.colorCode}
        style="background-color:rgb({color.r},{color.g},{color.b})"
    ></div>
{/each}
<form method="post" action="/upload" encType="multipart/form-data">
    <input type="file" accept="image/*" id="myFile" name="filename" />
    <input type="hidden" name="colors" value={colors} />
    <input type="submit" />
</form>
<button on:click={disableAll}>Disable All</button>

<style>
    .color {
        display: inline-block;
        width: 32px;
        height: 32px;
        border: 2px solid #ccc;
        margin: 6px;
    }
    .color.active {
        border: 2px solid #f00;
    }
</style>
