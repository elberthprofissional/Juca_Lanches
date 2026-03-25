// Configuração Tailwind - RÚSTICA E CHEDDAR
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
                serif: ['Oswald', 'sans-serif'], // Fonte mais robusta para lanchonete
            },
            colors: {
                premium: {
                    gold: '#F59E0B', // Amarelo Cheddar (abre mais o apetite)
                    goldHover: '#D97706', // Cheddar mais escuro para o hover
                    dark: '#0a0a0a',
                    card: '#141414',
                    border: 'rgba(245, 158, 11, 0.2)' // Borda com a cor ajustada
                }
            }
        }
    }
}