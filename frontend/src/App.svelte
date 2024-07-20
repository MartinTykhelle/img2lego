<script>
  import Preview from "./lib/Preview.svelte";
  import Upload from "./lib/Upload.svelte";
  import { db } from "./lib/db";
  import { onMount } from "svelte";
  import { liveQuery } from "dexie";

  onMount(async function () {
    db.table("legoColors")
      .count()
      .then(function (results) {
        if (results === 0) {
          fetch("/data/legoColors").then(function (rawResult) {
            rawResult.json().then(function (json) {
              for (let colorCode in json) {
                let color = json[colorCode];
                if (color.avaiable) {
                  db.table("legoColors").add({
                    colorCode: parseInt(colorCode),
                    r: color.r,
                    g: color.g,
                    b: color.b,
                    name: color.name,
                    enabled: color.enabled,
                  });
                }
              }
            });
          });
        }
      });
  });
</script>

<main>
  <Preview />
  <Upload />
</main>

<style>
</style>
