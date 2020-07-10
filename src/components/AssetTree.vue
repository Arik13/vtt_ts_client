<template>
    <v-container
            style="max-height: 600px"
            class="overflow-y-auto"
        >
        <v-card flat dark style="padding: 5px">
            <v-card-title style="margin: 0; padding: 0">{{title}}</v-card-title>
            <v-card-text style="padding: 0">
                <v-treeview
                    dense
                    :items="items"
                    :search="search"
                    :filter="filter"
                    :open.sync="open"
                >
                    <template v-slot:prepend="{ item }">
                        <v-icon
                            v-if="item.children"
                            v-text="`mdi-${item.id === 1 ? 'home-variant' : 'folder-network'}`"
                        ></v-icon>
                    </template>
                </v-treeview>

            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts">
export default {
    data: () => ({
        open: [1, 2],
        caseSensitive: false,
    }),
    props: {
        title: null,
        items: null,
        filter: null,
        search: null,
    },
    methods: {

    },
}
</script>