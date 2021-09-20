import { Collection } from "discord.js"

const steps = new Collection();

steps.set("register",(interaction, client) => {
    interaction.reply({
        content: "An application form has been sent to you.",
        ephemeral: true,
    });

    let registerCourses = [];
    interaction.values.forEach((value) => {
        registerCourses.push(client.courses.filter(i => i.id === value))
    });
    const application = new client.Mongo.getOrMakeApplication({
        _id: Types.ObjectId(),
        user: user,
        application: {
            courses: registerCourses,
        },
    });

    interaction.user.send(
        `Thank you for applying for programming simplified's courses.\n${registerCourses
            .map((registerCourse) => {
                return `\n**${registerCourse.name}**`;
            })
            .join("")}\nPlease answer the following questions to apply`
    );
    const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
            .setCustomId("age")
            .setPlaceholder("Select your age")
            .addOptions([
                {
                    label: "13",
                    value: "13",
                },
                {
                    label: "14",
                    value: "14",
                },
                {
                    label: "15",
                    value: "15",
                },
                {
                    label: "16",
                    value: "16",
                },
                {
                    label: "17",
                    value: "17",
                },
                {
                    label: "18+",
                    value: "18+",
                },
            ])
    );

    application.application.dmMessage = await interaction.user.send({
        content: "How old are you?",
        components: [row],
    });

    application.save();
})

steps.set("age", (interaction, apps) => {
    const ageApplication = apps[user.id].application;
    ageApplication.application.age = interaction.values[0];
    ageApplication.application.dmMessage.edit({
        content: "We have received your age",
        components: [],
    });

    apps.save().then((result) => {
        console.log(result);
    });
});

export const handle = (interaction, client) => {
    steps.get(interaction.customId)();
}

export const steps;