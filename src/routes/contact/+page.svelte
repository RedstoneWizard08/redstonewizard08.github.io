<script lang="ts">
    enum ValidationCause {
        FIRST_NAME,
        LAST_NAME,
        EMAIL_ADDRESS,
        PHONE_AREA_CODE,
        PHONE_PREFIX,
        PHONE_LINE_NUMBER,
        SUBJECT,
        MESSAGE,
        NONE,
    }

    const EMAIL_REGEX = /[^@]+@[^\.]+\..+/gm;

    let firstName = "";
    let lastName = "";

    let emailAddress = "";

    let phoneAreaCode = "";
    let phonePrefix = "";
    let phoneLineNumber = "";

    let subject = "";
    let message = "";

    const validate = () => {
        if (firstName == "" || lastName == "") return false;
        if (emailAddress == "" || !emailAddress.match(EMAIL_REGEX)) return false;

        if (phoneAreaCode == "" || phonePrefix == "" || phoneLineNumber == "") return false;
        if (phoneAreaCode.length < 3 || phonePrefix.length < 3 || phoneLineNumber.length < 4)
            return false;

        if (subject == "" || message == "") return false;

        return true;
    };

    const getErrorCause = () => {
        if (firstName == "") return ValidationCause.FIRST_NAME;
        if (lastName == "") return ValidationCause.LAST_NAME;

        if (emailAddress == "" || !emailAddress.match(EMAIL_REGEX))
            return ValidationCause.EMAIL_ADDRESS;

        if (phoneAreaCode == "" || phoneAreaCode.length < 3) return ValidationCause.PHONE_AREA_CODE;

        if (phonePrefix == "" || phonePrefix.length < 3) return ValidationCause.PHONE_PREFIX;

        if (phoneLineNumber == "" || phoneLineNumber.length < 3)
            return ValidationCause.PHONE_LINE_NUMBER;

        if (subject == "") return ValidationCause.SUBJECT;
        if (message == "") return ValidationCause.MESSAGE;

        return ValidationCause.NONE;
    };

    const showError = () => {
        const cause = getErrorCause();

        switch (cause) {
            case ValidationCause.FIRST_NAME:
                alert("Your first name cannot be blank!");

            case ValidationCause.LAST_NAME:
                alert("Your last name cannot be blank!");

            case ValidationCause.EMAIL_ADDRESS:
                alert("That is not a valid email!");

            case ValidationCause.PHONE_AREA_CODE:
            case ValidationCause.PHONE_PREFIX:
            case ValidationCause.PHONE_LINE_NUMBER:
                alert("That is not a valid phone number!");

            case ValidationCause.SUBJECT:
                alert("Your subject cannot be blank!");

            case ValidationCause.MESSAGE:
                alert("Your message cannot be blank!");
        }
    };

    const submit = () => {
        const isValid = validate();

        if (!isValid) showError();

        let email = "mailto:redstonewizard08@nosadnile.net";

        email += `?subject=${subject}`;

        let body = `
        ${message}

        ===================
        CONTACT INFORMATION
        ===================

        Name (First, Last): ${firstName} ${lastName}
        Email: ${emailAddress}
        Phone Number: (${phoneAreaCode}) ${phonePrefix}-${phoneLineNumber}
        `
            .replaceAll(" ", "%20")
            .replaceAll("\n", "%0D0A");

        email += `&body=${body}`;

        window.open(email);
    };
</script>

<svelte:head>
    <title>Contact | RedstoneWizard08</title>
</svelte:head>

<section class="info">
    <p class="title">Contact</p>
    <p class="text">
        Feel free to send me an email using this<br />
        form, and I'll get back to you as soon as I can!
    </p>
</section>

<form action="#" on:submit|preventDefault={submit} class="form">
    <label for="name">Name <b>*</b></label>

    <fieldset name="name" class="name-section">
        <input type="text" name="firstName" class="input" bind:value={firstName} />

        <input type="text" name="lastName" class="input" bind:value={lastName} />
    </fieldset>

    <div class="name-text">
        <label for="firstName" class="text">First Name</label>
        <label for="lastName" class="text">Last Name</label>
    </div>

    <br />

    <label for="email" class="label">Email Address <b>*</b></label>
    <input type="email" name="email" class="input" bind:value={emailAddress} />

    <br />

    <label for="phone" class="margin-top">Phone Number <b>*</b></label>

    <fieldset name="phone" class="phone-section">
        <input type="text" class="input" name="p_areacode" bind:value={phoneAreaCode} />
        <input type="text" class="input" name="p_prefix" bind:value={phonePrefix} />
        <input type="text" class="input" name="p_linenumber" bind:value={phoneLineNumber} />
    </fieldset>

    <div class="phone-text">
        <label for="p_areacode" class="text">(###)</label>
        <label for="p_prefix" class="text">###</label>
        <label for="p_linenumber" class="text">####</label>
    </div>

    <br />

    <label for="subject" class="label">Subject <b>*</b></label>
    <input type="text" class="input" name="subject" bind:value={subject} />

    <br />

    <label for="message" class="label margin-top">Message <b>*</b></label>
    <textarea name="message" class="textarea" bind:value={message} />

    <button type="submit" class="submit">Submit</button>
</form>

<style lang="scss">
    @import "../../styles/variables";

    .info {
        width: calc(100% - 2rem);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 1rem;

        .title {
            font-size: 30pt;
            font-weight: bold;

            margin-bottom: 2%;
        }

        .text {
            margin: 0;
            font-size: 13pt;
            text-align: center;
        }
    }

    .form {
        width: calc(100% - 50rem);
        padding: 1rem 25rem;

        display: flex;
        flex-direction: column;
        align-items: left;
        justify-content: center;

        .name-section {
            border: none;
            margin: 0;
            padding: 0.5rem 0;
            width: 100%;
            height: 2.5rem;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .input {
                width: calc(50% - 2rem);
                height: calc(2.5rem - 1rem);
                padding: 0.5rem;
                border: none;
                outline: none;
                border: 1px solid rgba(255, 255, 255, 0.3);
                background-color: transparent;
                color: #ffffff;

                transition: border 0.5s ease;

                &:focus {
                    border: 1px solid rgba(255, 255, 255, 0.8);
                }
            }
        }

        .name-text {
            margin: 0;
            width: 100%;
            margin-bottom: 2rem;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            .text {
                width: 50%;
                padding: 0rem 0rem;

                &:not(:last-of-type) {
                    margin-right: 2rem;
                }
            }
        }

        .phone-section {
            border: none;
            margin: 0;
            padding: 0.5rem 0;
            width: 100%;
            height: 2.5rem;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .input {
                width: calc((100% / 3) - 2rem);
                height: calc(2.5rem - 1rem);
                padding: 0.5rem;
                border: none;
                outline: none;
                border: 1px solid rgba(255, 255, 255, 0.3);
                background-color: transparent;
                color: #ffffff;

                transition: border 0.5s ease;

                &:focus {
                    border: 1px solid rgba(255, 255, 255, 0.8);
                }
            }
        }

        .phone-text {
            margin: 0;
            width: 100%;
            margin-bottom: 2rem;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            .text {
                width: calc(100% / 3);
                padding: 0rem 0rem;

                &:not(:last-of-type) {
                    margin-right: 1.5rem;
                }
            }
        }

        .input {
            width: calc(100% - 1rem);
            height: calc(2.5rem - 1rem);
            padding: 0.5rem;
            border: none;
            outline: none;
            border: 1px solid rgba(255, 255, 255, 0.3);
            background-color: transparent;
            color: #ffffff;

            transition: border 0.5s ease;

            &:focus {
                border: 1px solid rgba(255, 255, 255, 0.8);
            }
        }

        .label {
            margin: 0.5rem 0rem;
        }

        .textarea {
            height: 12rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            outline: none;
            padding: 0.5rem;
            background-color: transparent;
            color: #ffffff;

            transition: border 0.5s ease;

            &:focus {
                border: 1px solid rgba(255, 255, 255, 0.8);
            }
        }

        .submit {
            border: none;
            background-color: $buttonBackground;
            color: $buttonColor;
            width: 20%;
            height: 3rem;

            margin: 1.5rem 0;
            border-radius: 8px;
            cursor: pointer;

            transition:
                color 0.5s ease,
                background-color 0.5s ease;
            font-family: "Ubuntu Mono";
            font-size: 12pt;

            &:hover {
                background-color: $buttonBackgroundHover;
                color: $buttonColorHover;
            }
        }

        .margin-top {
            margin-top: 2rem;
        }
    }

    @media screen and (max-width: 850px) {
        .form {
            width: calc(100% - 2rem);
            padding: 1rem;
        }
    }
</style>
