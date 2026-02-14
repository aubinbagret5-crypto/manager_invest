// Vérifie si déjà connecté
if(localStorage.getItem('currentUser')) showDashboard();

function showLogin(){ document.getElementById('signup-form').style.display='none'; document.getElementById('login-form').style.display='block'; }
function showSignup(){ document.getElementById('signup-form').style.display='block'; document.getElementById('login-form').style.display='none'; }

function signup(){
    let users=JSON.parse(localStorage.getItem('users')||'[]');
    let name=document.getElementById('name').value;
    let email=document.getElementById('email').value;
    let password=document.getElementById('password').value;
    if(!name||!email||!password) return alert("Remplissez tous les champs");
    
    let user={name,email,password,solde:1500,bonus:1500,investments:[]};
    users.push(user);
    localStorage.setItem('users',JSON.stringify(users));
    localStorage.setItem('currentUser',JSON.stringify(user));
    alert("Compte créé ! Bonus 1500 ajouté");
    showDashboard();
}

function login(){
    let email=document.getElementById('login-email').value;
    let password=document.getElementById('login-password').value;
    let users=JSON.parse(localStorage.getItem('users')||'[]');
    let user=users.find(u=>u.email===email && u.password===password);
    if(user){ localStorage.setItem('currentUser',JSON.stringify(user)); showDashboard(); }
    else alert("Email ou mot de passe incorrect");
}

function showDashboard(){
    document.getElementById('auth-section').style.display='none';
    document.getElementById('dashboard').style.display='block';
    updateSolde();
}

function updateSolde(){
    let user=JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('user-name').innerText=user.name;
    document.getElementById('solde').innerText=user.solde;
    document.getElementById('bonus').innerText=user.bonus;
}

function invest(button){
    let planDiv=button.parentElement;
    let montant=parseInt(planDiv.getAttribute('data-montant'));
    let user=JSON.parse(localStorage.getItem('currentUser'));
    if(user.solde<montant){ alert("Solde insuffisant"); return; }
    user.solde-=montant;
    user.bonus=0; // bonus débloqué après investissement
    user.investments.push({plan:planDiv.querySelector('h3').innerText, montant, start:new Date().getTime(), joursPasses:0, termine:false});
    updateUserData(user);
    updateSolde();
}

function updateUserData(user){
    let users=JSON.parse(localStorage.getItem('users')||'[]');
    let index=users.findIndex(u=>u.email===user.email);
    if(index!==-1){ users[index]=user; localStorage.setItem('users',JSON.stringify(users)); }
    localStorage.setItem('currentUser',JSON.stringify(user));
}

function recharge(){ alert("Simulation Recharge"); }
function retrait(){ alert("Simulation Retrait"); }
