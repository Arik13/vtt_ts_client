<template>
<!-- Asset Manager -->
    <v-card dark height="100%" tile>
        <!-- Search element -->
        <v-card flat dense>
            <v-card-text>
                <v-text-field
                    v-model="search"
                    label="Search Assets"
                    dark
                    flat
                    solo-inverted
                    hide-details
                    clearable
                    clear-icon="mdi-close-circle-outline"
                ></v-text-field>

                <v-checkbox
                    v-model="caseSensitive"
                    dark
                    hide-details
                    label="Case sensitive search"
                ></v-checkbox>
                <v-file-input
                    v-model="files"
                    label="Add File"
                    filled
                    dense
                    name="fileInput" id="fileInput" ref="fileInput" multiple @change="uploadFiles()"
                ></v-file-input>
            </v-card-text>
        </v-card>
        <!-- Asset Tabs -->
        <vertical-tabs :tabNames="tabs" :verticalText="true" >
            <template>
                <!-- Asset Trees -->
                <v-tab-item :value="'Graphics'">
                    <asset-tree :title="'Graphics'" :items="graphicItems" :filter="filter" :search="search" />
                </v-tab-item>
                <v-tab-item :value="'Lights'">
                    <asset-tree :title="'Lights'" :items="lightItems" :filter="filter" :search="search" />
                </v-tab-item>
                <v-tab-item :value="'Characters'">
                    <asset-tree :title="'Characters'" :items="characterItems" :filter="filter" :search="search" />
                </v-tab-item>
            </template>
        </vertical-tabs>
    </v-card>

</template>

<script lang="ts">
import Vue from "vue";
import AssetTree from "../components/AssetTree.vue";
import VerticalTabs from "../components/VerticalTabs.vue";

export default Vue.extend({
    data: () => ({
        caseSensitive: false,
        tabs: ["Graphics", "Lights", "Characters"],
        graphicItems: [],
        lightItems: [],
        characterItems: [],
        search: null,
        files: [],
    }),
    components: {
        "asset-tree": AssetTree,
        "vertical-tabs": VerticalTabs,
    },
    methods: {
        uploadFiles() {
            const files = this.files;
            if (!files.length) return;
            const file = files[0] as File;
            this.$store.dispatch("triggerEvent", {
                eventType: "UploadImage", event: {
                    campaignID: this.$store.state.campaignID,
                        name: file.name,
                        file: file,
                    }
                }
            );
            // const formData = new FormData();
            // for( let i = 0; i < files.length; i++ ){
            //     formData.append('files[' + i + ']', files[i]);
            // }
            // const payload = {
                //     method: "POST",
            //     route: `campaigns/${this.$store.state.campaignObject._id}/images`,
            //     headers: { "Content-Type": "multipart/form-data" },
            //     data: formData,
            //     callback: () => {
                //         this.files = null;
            //     }
            // };
            // this.$store.dispatch("accessResource", payload);
        }
    },
    computed: {
        filter () {
            return this.caseSensitive? (item: Array<string>, search: string, textKey: number) => item[textKey].indexOf(search) > -1 : undefined
        },
    },
});
/*
items: [
            {
                id: 1,
                name: 'Vuetify Human Resources',
                children: [
                    {id: 2, name: 'Core team', children:
                        [
                            {id: 201, name: 'John',},
                            {id: 202, name: 'Kael',},
                            {id: 203, name: 'Nekosaur',},
                            {id: 204, name: 'Jacek',},
                            {id: 205, name: 'Andrew',},
                        ],
                    },
                    {
                        id: 3,
                        name: 'Administrators',
                        children: [
                            {id: 301, name: 'Ranee',},
                            {id: 302, name: 'Rachel',},
                        ],
                    },
                    {
                        id: 4,
                        name: 'Contributors',
                        children: [
                            {id: 401, name: 'Phlow',},
                            {id: 402, name: 'Brandon',},
                            {id: 403, name: 'Sean',},
                        ],
                    },
                ],
            },
        ],
*/
</script>
