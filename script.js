if(localStorage.getItem('currentUser')) showDashboard();

function showLogin(){ document.getElementById('signup-form').style.display='none'; document.getElementById('login-form').style.display='block'; }
function showSignup(){ document.getElementById('signup-form').style.display='block'; document.getElementById('login-form').style.display='none'; }

function signup(){
    let users=JSON.parse(localStorage.getItem('users')||'[]');
    let name=document.getElementById('name').value;
    let email=document.getElementById('email').value;
    let password=document.getElementById('password').value;
    let referral=document.getElementById('referral').value;
    let solde=1500;
    let user={name,email,password,solde,bonus:1500,investments:[],referralCode:email};

    if(referral){
        let parrain=users.find(u=>u.referralCode===referral);
        if(parrain) parrain.solde+=0;
    }

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
    displayInvestments();
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
    let revenu=parseInt(planDiv.getAttribute('data-revenu'));
    let duree=parseInt(planDiv.getAttribute('data-duree'));
    let user=JSON.parse(localStorage.getItem('currentUser'));

    if(user.solde<montant){ alert("Solde insuffisant"); return; }

    user.bonus=0;
    user.solde-=montant;
    user.investments.push({plan:planDiv.querySelector('h3').innerText, montant, revenu, duree, start:new Date().getTime(), joursPasses:0, termine:false});

    updateUserData(user);
    updateSolde();
    displayInvestments();
}

function displayInvestments(){
    let user=JSON.parse(localStorage.getItem('currentUser'));
    let container=document.getElementById('investments-container');
    container.innerHTML='';
    user.investments.forEach(inv=>{
        let div=document.createElement('div'); div.className='plan';
        let jours=Math.floor((new Date().getTime()-inv.start)/(1000*60*60*24));
        if(jours>=inv.duree){ inv.termine=true; jours=inv.duree; }
        inv.joursPasses=jours;
        div.innerHTML=`<h3>${inv.plan}</h3><p>Montant investi: ${inv.montant}</p><p>Jours: ${jours}/${inv.duree}</p><p>Statut: ${inv.termine?'Terminé':'En cours'}</p>`;
        container.appendChild(div);
        if(!inv.termine) user.solde+=inv.revenu;
    });
    updateUserData(user);
    updateSolde();
}

function recharge(){
    let numero=prompt("Entrez votre numéro");
    let reseau=prompt("Entrez le réseau (ex: MTN, Orange)");
    let montant=parseInt(prompt("Montant à recharger"));
    if(!numero||!reseau||!montant||montant<=0) return alert("Informations invalides");
    alert(`Veuillez effectuer le transfert de ${montant} sur le numéro 1234567890`);
}

function retrait(){
    let numero=prompt("Entrez votre numéro pour le retrait");
    let reseau=prompt("Entrez le réseau");
    let montant=parseInt(prompt("Montant à retirer"));
    let user=JSON.parse(localStorage.getItem('currentUser'));
    if(!numero||!reseau||!montant||montant<=0) return alert("Informations invalides");
    if(montant>user.solde) return alert("Solde insuffisant");
    user.solde-=montant;
    updateUserData(user);
    updateSolde();
}

function updateUserData(user){
    let users=JSON.parse(localStorage.getItem('users')||'[]');
    let index=users.findIndex(u=>u.email===user.email);
    if(index!==-1){ users[index]=user; localStorage.setItem('users',JSON.stringify(users)); }
    localStorage.setItem('currentUser',JSON.stringify(user));
}