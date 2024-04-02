const template = `
    <footer class="py-3 text-center bg-dark-blue">
       Copyright &copy;{{currentYear}} WorldSkills Games
    </footer>
`;

export default{
    template,
    setup(){
        const currentYear = new Date().getFullYear();
        return {
            currentYear
        }
    }

}