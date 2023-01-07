<script lang="ts">
    import { base } from "$app/paths";
</script>

<svelte:head>
    <title>404 | RedstoneWizard08</title>
</svelte:head>

<div class="error">
    <h1 class="error--title">404</h1>
    <h3 class="error--text">I'm sorry, but I can't find that page.</h3>
    <a class="error--link" href="{base}/">Back to Home</a>
</div>

<style lang="scss">
    @import "../styles/variables";

    .error {
        width: 100%;
        height: calc(100% - 6rem);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &--title {
            color: $bodyColor;
            margin-bottom: 1%;
        }

        &--text {
            color: $bodyColor;
            margin-top: 0;
        }

        &--link {
            color: $buttonColor;
            text-decoration: none;
            background-color: $buttonBackground;
            cursor: pointer;
            padding: 1%;
            border: 1px solid $buttonBorderColor;
            border-radius: 8px;

            transition: background-color 0.5s ease, color 0.5s ease;

            &:hover {
                color: $buttonColorHover;
                background-color: $buttonBackgroundHover;
            }
        }
    }
</style>
