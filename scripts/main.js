const j = React.createElement;
const renderer = ReactDOM.render;
const numberRounder = /([0-9]\.[0-9]{2})/;
const jss = JSON.stringify;
const jsp = JSON.parse;
const cli = console.info;
/* 
Récupération ou création de la base de donnée locale
*/
if(!localStorage.bourse){
    localStorage.bourse = jss({
        timestamp: [],
        nasdaq: [],
        cac40: []
    })
    bourse = jsp(localStorage.bourse)
}else{
    bourse = jsp(localStorage.bourse)
}
/* 
Cette fonction met à jour le graphique
*/
function fullChart(props){
    var traceur = document.querySelector('#courbes')
    if (props !== undefined && props.length != 0){
        console.groupCollapsed('Élément React: "fullChart()" Voir plus...')
        window.xAxis = props.map((date, index) =>{
            return index+1
        })
        cli('creation de l\'axe X')
        window.timestamp = props.map(date=>{
            return date.timestamp
        })
        cli('récupération des tampons temporels')
        window.nasdaqFunc = props.map(stat=>{
            return numberRounder.exec(stat.stocks.NASDAQ)[0]
        })
        cli('récupération des statistiques pour le NASDAQ')
        window.cacFunc = props.map(stat =>{
            return numberRounder.exec(stat.stocks.CAC40)[0]
        })
        cli('récupération des statistiques pour le CAC40')
        cli('configuration de la trace NASDAQ')
        window.traceN = {
            x: xAxis,
            y: nasdaqFunc,
            mode: 'lines+markers',
            name: "NASDAQ",
            line: {
                color: 'rgb(0,128,128)'
            }
        };
        cli('configuration de la trace CAC40')
        window.traceC = {
            x: xAxis,
            y: cacFunc,
            mode: 'lines+markers',
            name: "CAC40",
            line: {
                color: 'rgb(212,112,28)'
            }
        };
        cli('activation du graphique')
        Plotly.react(traceur, [traceN, traceC])
        cli('sauvegarde des nouvelles statistiques en mémoire vive')
        bourse.timestamp = timestamp
        bourse.nasdaq = nasdaqFunc
        bourse.cac40 = cacFunc
        cli('sauvegarde persistante en cours...')
        localStorage.bourse = jss(bourse)
        cli('sauvegarde terminé')
        console.groupEnd()
        return j('h2', {class: 'titre'}, "NASDAQ et CAC40")
    }else{
        console.groupCollapsed('Élément React: "fullChart()" Voir plus...')
        cli('aucune donnée n\'a été reçu')
        console.groupEnd()
        return j('h2', {class: 'titre'}, "Chargement")
    }
}
function oldData(props){
    var traceur = document.querySelector('#courbes')
    //new Date(date.timestamp).toLocaleString('fr-FR', { timeZone: 'UTC', year: "numeric", month:"numeric", day:"numeric" })
        if (props !== undefined && props.length != 0){
            console.groupCollapsed('Élément React: "oldData()" Voir plus...')
            var currentDataDOM = []
            cli('ittération sur les éléments enregistés dans la mémoire vive nommée "backup"')
            cli('récupération des données: "timestamp", "NASDAQ stocks", "CAC40 stocks"')
            cli('création et structuration des élément React')
            cli('création de la ".datadiv" qui affiche les éléments créés précédemment')
            console.groupEnd()
                props.timestamp.forEach((dataNow, i) =>{
                    currentDataDOM.push(j('ul', {class:'case-'+(i+1)}, [
                        j('li', {class:'hour'}, new Date(props.timestamp[i]).toLocaleString('fr-FR', { timeZone: 'UTC', hour: "numeric", minute:"numeric", second:"numeric" })),
                        j('li', {class:'nasdaq', onClick: (e)=>{
                            e.target.setAttribute('contenteditable', true)
                            e.target.focus()
                            e.target.addEventListener('keydown', eb=>{
                                if(eb.code === 'Enter' || eb.code === 'NumpadEnter'){
                                    eb.preventDefault();
                                    document.execCommand('insertHTML', false, '')
                                    eb.target.setAttribute('contenteditable', false)
                                    nasdaqFunc[eb.target.dataset.index] = eb.target.innerText
                                    Plotly.redraw(traceur);
                                    bourse.nasdaq = nasdaqFunc
                                    localStorage.bourse = jss(bourse)
                                    localStorage.backup = localStorage.bourse
                                    return false
                                }
                            })
                            //fin du nasdaq
                        }, "data-index": i}, props.nasdaq[i]),
                        j('li', {class:'cac40', onClick: (e)=>{
                            e.target.setAttribute('contenteditable', true)
                            e.target.focus()
                            e.target.addEventListener('keydown', eb=>{
                                if(eb.code === 'Enter' || eb.code === 'NumpadEnter'){
                                    eb.preventDefault();
                                    document.execCommand('insertHTML', false, '')
                                    eb.target.setAttribute('contenteditable', false)
                                    cacFunc[eb.target.dataset.index] = eb.target.innerText
                                    Plotly.redraw(traceur);
                                    bourse.cac40 = cacFunc
                                    localStorage.bourse = jss(bourse)
                                    localStorage.backup = localStorage.bourse
                                    return false
                                }
                            })
                            //fin du cac40
                        }, "data-index": i}, props.cac40[i])
                    ]))
                })
                cli('creation du boutton "back to live"')
                cli('en attente...')
                var btn = document.createElement('button')
                btn.classList.add('retouraudirect')
                btn.innerText = 'back to live'
                document.querySelector('body').appendChild(btn)
                btn.addEventListener('click', (e)=>{
                    renderer(j(pathMaker, null, null), document.querySelector('#main'))
                    btn.style.display = "none";
                    document.querySelector('.oldbtn').style.display = "block";
                }, false)
            return [ j('h2', {class: 'titre'}, "NASDAQ et CAC40"),
                    j('div', {class:'datadiv'}, currentDataDOM)]
        }else{
            console.groupCollapsed('Élément React: "oldData()" Voir plus...')
            cli('aucune donnée n\'a été reçu')
            console.groupEnd()
            return j('div', {class:'datadiv'}, 'data')
        }
}
function chartData(props){
    var traceur = document.querySelector('#courbes')
//new Date(date.timestamp).toLocaleString('fr-FR', { timeZone: 'UTC', year: "numeric", month:"numeric", day:"numeric" })
    if (props !== undefined && props.length != 0){
        console.groupCollapsed('Élément React: "chartData()" Voir plus...')
            cli('ittération sur les éléments enregistés dans la mémoire vive nommée "bourse"')
            cli('récupération des données: "timestamp", "NASDAQ stocks", "CAC40 stocks"')
            cli('création et structuration des élément React')
            cli('création de la ".datadiv" qui affiche les éléments créés précédemment')
            
        var currentDataDOM = props.map((dataNow, index)=>{
            return j('ul', {class:'case-'+(index+1)}, [
                j('li', {class:'hour'}, new Date(dataNow.timestamp).toLocaleString('fr-FR', { timeZone: 'UTC', hour: "numeric", minute:"numeric", second:"numeric" })),
                j('li', {class:'nasdaq', onClick: (e)=>{
                    e.target.setAttribute('contenteditable', true)
                    cli('modification en cours')
                    e.target.focus()
                    e.target.addEventListener('keydown', eb=>{
                        if(eb.code === 'Enter' || eb.code === 'NumpadEnter'){
                            cli('modification terminée, enregistrement en cours')
                            eb.preventDefault();
                            document.execCommand('insertHTML', false, '')
                            eb.target.setAttribute('contenteditable', false)
                            nasdaqFunc[eb.target.dataset.index] = eb.target.innerText
                            Plotly.redraw(traceur);
                            bourse.nasdaq = nasdaqFunc
                            localStorage.bourse = jss(bourse)
                            localStorage.backup = localStorage.bourse
                            return false
                        }
                    })
                    //fin du nasdaq
                }, "data-index": index}, numberRounder.exec(dataNow.stocks.NASDAQ)[0]),
                j('li', {class:'cac40', onClick: (e)=>{
                    e.target.setAttribute('contenteditable', true)
                    cli('modification en cours')
                    e.target.focus()
                    e.target.addEventListener('keydown', eb=>{
                        if(eb.code === 'Enter' || eb.code === 'NumpadEnter'){
                            cli('modification terminée, enregistrement en cours')
                            eb.preventDefault();
                            document.execCommand('insertHTML', false, '')
                            eb.target.setAttribute('contenteditable', false)
                            cacFunc[eb.target.dataset.index] = eb.target.innerText
                            Plotly.redraw(traceur);
                            bourse.cac40 = cacFunc
                            localStorage.bourse = jss(bourse)
                            localStorage.backup = localStorage.bourse
                            return false
                        }
                    })
                    //fin du cac40
                }, "data-index": index}, numberRounder.exec(dataNow.stocks.CAC40)[0])
            ])
        })
        console.groupEnd()
        return j('div', {class:'datadiv'}, currentDataDOM)
    }else{
        console.groupCollapsed('Élément React: "chartData()" Voir plus...')
        cli('aucune donnée n\'a été reçu')
        console.groupEnd()
        return j('div', {class:'datadiv'}, [
            j('h2', {class: 'titre'}, 'Connexion au service')
        ])
    }
}
function fetcher(){
    console.groupCollapsed('Fonction: "fetcher()" Voir plus...')
    cli('envois de la requête fetch vers le port 8000')
    fetch("http://localhost:8000/?count=20").then(res=>{
                cli('interprétation de la réponse en JSON')
                return res.json()
            }).then(result=>{
                cli('enregistrement des données désirée')
                this.data = result
                cli('renvois des donnée vers la mémoire vive')
                console.groupEnd()
                return result
            })
}

class pathMaker extends React.Component{
    constructor(props){
        super(props)
        this.data = []
    }
    componentDidMount(){
        console.groupCollapsed('Composant React: "pathMaker" Voir plus...')
        cli('création d\'une fonction interval qui s\'occupe de répcupérer les données auprès du service')
            var intervalStarter = function(){
                var monInterval = window.setInterval(function(){
                    document.body.addEventListener('click', e=>{
                        if(document.querySelector('.retouraudirect') === null){
                            e.stopImmediatePropagation()
                            clearInterval(monInterval)
                            var btn = document.createElement('button')
                            btn.classList.add('retouraudirect')
                            btn.innerText = 'back to live'
                            document.querySelector('body').appendChild(btn)
                            btn.addEventListener('click', (e)=>{
                                //e.stopPropagation()
                                renderer(j(pathMaker, null, null), document.querySelector('#main'))
                                btn.style.display = "none";
                                document.querySelector('.oldbtn').style.display = "block";
                            }, false)
                        }else{
                            clearInterval(monInterval)
                        }
                    }, false)
                    fetcher()
                    renderer(j('div', {class: 'courbe'}, [fullChart(this.data), chartData(this.data)]), document.querySelector('#main'))
                }, 1000)
            }
            cli('activation de la fonction interval précédement crée')
            intervalStarter()
            window.onload = ()=>{
            cli('verification de la présence d\'une sauvegarde')
            
                if(localStorage.backup){
                    cli('une sauvegarde existe. Création d\'un boutton pour charger la sauvegarde')
                    var btn = document.createElement('button');
                    btn.innerText = 'Load the last graphic'
                    btn.classList.add('oldbtn')
                    document.querySelector('body').appendChild(btn)
                    btn.addEventListener('click', (e)=>{
                        var traceur = document.querySelector('#courbes')
                        window.backup = jsp(localStorage.backup)
                        nasdaqFunc = backup.nasdaq
                        cacFunc = backup.cac40
                        Plotly.purge(traceur)
                        window.traceNOld = {
                            x: xAxis,
                            y: backup.nasdaq,
                            mode: 'lines+markers',
                            name: "NASDAQ",
                            line: {
                                color: 'rgb(0,128,128)'
                            }
                        };
                        window.traceCOld = {
                            x: xAxis,
                            y: backup.cac40,
                            mode: 'lines+markers',
                            name: "CAC40",
                            line: {
                                color: 'rgb(212,112,28)'
                            }
                        };
                        Plotly.react(traceur, [window.traceNOld, window.traceCOld])
                        renderer(j('div', {class: 'courbe'},[oldData(backup)]), document.querySelector('#main'))
                        btn.style.display = 'none';
                    })
                }else{
                    cli('aucne sauvegarde n\'a été trouvée')
                }
            }
            
    }
    render(){
        cli('fonction "render" du composant en éxécution')
        fetch("http://localhost:8000/?count=20").then(res=>{
                return res.json()
            }).then(result=>{
                this.data = result
            })
            console.groupEnd()
        return j('div', {class: 'courbe'}, [fullChart(this.data), chartData(this.data)])
    }
}
renderer(j(pathMaker, null, null), document.querySelector('#main'))


