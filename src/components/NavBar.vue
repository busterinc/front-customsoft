<template>
	<div>
		<v-toolbar
			image="https://picsum.photos/1920/1080?random"
			dark
			prominent
		>
			<v-app-bar-nav-icon @click="menu = !menu"></v-app-bar-nav-icon>
	
			<v-toolbar-title>CUSTOMSOFT - FILE MANAGER</v-toolbar-title>
	
			<v-spacer></v-spacer>
	
			<v-btn icon>
				<v-icon>mdi-export</v-icon>
			</v-btn>
		</v-toolbar>
  
		<div class="text-center">
			<v-menu v-model="menu" :close-on-content-click="false" location="end">
				<v-card min-width="300">
					<v-list>
						<v-list-item
							prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
							subtitle="Tech Lead CustomSoft"
							title="Angel Ro."
						>
							<template v-slot:append>
								<v-btn
									:class="fav ? 'text-red' : ''"
									icon="mdi-heart"
									variant="text"
									@click="fav = !fav"
								></v-btn>
							</template>
						</v-list-item>
					</v-list>
		
					<v-divider></v-divider>
		
					<v-list>
						<v-list-item
							prepend-icon="mdi-home-city"
							title="Inicio"
							value="home"
							@click="goTo('Home')"
						></v-list-item>
						<v-list-item
							prepend-icon="mdi-account"
							title="Mi cuenta"
							value="account"
							@click="goTo('MyAccount')"
						></v-list-item>
						<v-list-item
							prepend-icon="mdi-folder"
							title="Archivos"
							value="files"
							@click="goTo('UploadFile')"
						></v-list-item>
					</v-list>
		
					<v-card-actions>
						<v-spacer></v-spacer>

						<v-btn variant="text" @click="goTo('LogIn')">Log-in</v-btn>
						<v-btn color="primary" variant="text" @click="userOut()">Log-out</v-btn>
					</v-card-actions>
				</v-card>
			</v-menu>
		</div>
	</div>
  </template>
  
<script>
import { defineComponent } from 'vue';
import { useAppStore } from '../stores/app.js';
import { storeToRefs } from 'pinia'
import router from '../router';
  
export default defineComponent({
	name: 'SalesAdmin',
	props: {
	  active: Boolean
	},
	setup() {
		const store = useAppStore();
      	const { isLogIn } = storeToRefs(store);

		// data
		const fav = ref(false)
		const menu = ref(false)
		const message = ref(false)
		const hints = ref(true)
	
		const goTo = (link) => {
			if (link === 'UploadFile') router.push('/upload-files');
			if (link === 'MyAccount') router.push('/my-account');
			if (link === 'Home') router.push('/');
			if (link === 'LogIn') router.push('/sign-in');
		};

		const userOut = async () => {
			await store.LogOut();
			menu.value = !menu.value
		}
	
		return {
			goTo,
			isLogIn,
			fav,
			menu,
			message,
			hints,
			userOut,
		};
	}
});
</script>
