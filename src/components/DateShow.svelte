<script lang="ts">
    import { onMount } from "svelte";

    let date = $state(new Date());

    onMount(() => {
        setInterval(() => date = new Date(), 1000);
    });
</script>

<span class="color-purple ml-5">{date.toUTCString()}</span>
