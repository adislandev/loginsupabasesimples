document.addEventListener('DOMContentLoaded', () => {
    // Chama a função para ouvir mudanças de autenticação assim que o DOM estiver carregado
    listenToAuthChanges();

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutButton = document.getElementById('logoutButton');
    const errorMessageElement = document.getElementById('error-message');
    const successMessageElement = document.getElementById('success-message');
    const userEmailElement = document.getElementById('userEmail');

    // --- Funções Auxiliares para Mensagens ---
    function displayError(message) {
        if (errorMessageElement) {
            errorMessageElement.textContent = message;
        }
    }

    function displaySuccess(message) {
        if (successMessageElement) {
            successMessageElement.textContent = message;
        }
    }

    function clearMessages() {
        if (errorMessageElement) {
            errorMessageElement.textContent = '';
        }
        if (successMessageElement) {
            successMessageElement.textContent = '';
        }
    }

    // --- Lógica de Login ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearMessages();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            const { data, error } = await signIn(email, password);

            if (error) {
                displayError(error.message);
            } else {
                // O onAuthStateChange em auth.js cuidará do redirecionamento
                // Não é necessário redirecionar aqui explicitamente se o login for bem-sucedido
                // A menos que você queira mostrar uma mensagem de sucesso antes do redirecionamento
            }
        });
    }

    // --- Lógica de Cadastro ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearMessages();
            const email = signupForm.email.value;
            const password = signupForm.password.value;

            const { data, error } = await signUp(email, password);

            if (error) {
                displayError(error.message);
            } else {
                displaySuccess('Cadastro realizado com sucesso! Verifique seu email para confirmação, se aplicável. Você será redirecionado em breve.');
                // O onAuthStateChange em auth.js pode cuidar do redirecionamento após a confirmação do e-mail (se habilitado)
                // ou imediatamente se a confirmação não for necessária/após o primeiro login.
                // Se a confirmação de email estiver habilitada no Supabase, o usuário não será logado imediatamente.
                if (data.user && data.user.identities && data.user.identities.length > 0) {
                     // Usuário criado, mas pode precisar de confirmação
                     if (!data.session) { // ou data.user.email_confirmed_at === null
                        // Não há sessão ativa, significa que a confirmação de e-mail é provavelmente necessária
                     }
                }
                 // Para um redirecionamento imediato para o login após o cadastro bem-sucedido:
                 // setTimeout(() => { window.location.href = 'index.html'; }, 3000);
            }
        });
    }

    // --- Lógica de Logout ---
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            clearMessages();
            const { error } = await signOut();
            if (error) {
                // Normalmente não haverá erro no logout, mas é bom tratar
                alert('Erro ao fazer logout: ' + error.message); // Usando alert aqui para simplicidade
            }
            // O onAuthStateChange em auth.js cuidará do redirecionamento para index.html
        });
    }

    // --- Lógica para exibir informações do usuário no menu ---
    async function displayUserInfo() {
        if (userEmailElement) {
            const user = await getCurrentUser();
            if (user) {
                userEmailElement.textContent = user.email;
            } else {
                 // Isso não deve acontecer se onAuthStateChange estiver funcionando corretamente,
                 // pois o usuário não logado seria redirecionado de menu.html
                console.log("Tentativa de exibir informações do usuário no menu, mas nenhum usuário encontrado.");
            }
        }
    }

    // Se estivermos na página de menu, tente exibir as informações do usuário
    if (window.location.pathname.endsWith('menu.html')) {
        displayUserInfo();
    }

}); 