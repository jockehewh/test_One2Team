const j = React.createElement;
const renderer = ReactDOM.render;
const numberRounder = /([0-9]\.[0-9]{2})/;
const jss = JSON.stringify;
const jsp = JSON.parse;
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
/* window.onbeforeunload = ()=>{
    localStorage.backup = localStorage.bourse
} */
function fullChart(props){
    var traceur = document.querySelector('#courbes')
    if (props !== undefined && props.length != 0){
        window.xAxis = props.map((date, index) =>{
            return index+1
        })
        window.timestamp = props.map(date=>{
            return date.timestamp
        })
        window.nasdaqFunc = props.map(stat=>{
            return numberRounder.exec(stat.stocks.NASDAQ)[0]
        })
        window.cacFunc = props.map(stat =>{
            return numberRounder.exec(stat.stocks.CAC40)[0]
        })
        window.traceN = {
            x: xAxis,
            y: nasdaqFunc,
            mode: 'lines+markers',
            name: "NASDAQ",
            line: {
                color: 'rgb(0,128,128)'
            }
        };
        window.traceC = {
            x: xAxis,
            y: cacFunc,
            mode: 'lines+markers',
            name: "CAC40",
            line: {
                color: 'rgb(212,112,28)'
            }
        };
        Plotly.react(traceur, [traceN, traceC])
        bourse.timestamp = timestamp
        bourse.nasdaq = nasdaqFunc
        bourse.cac40 = cacFunc
        localStorage.bourse = jss(bourse)
        return j('h2', {class: 'titre'}, "NASDAQ et CAC40")
    }
    return j('h2', {class: 'titre'}, "Chargement")
}
function oldData(props){
    
    var traceur = document.querySelector('#courbes')
    //new Date(date.timestamp).toLocaleString('fr-FR', { timeZone: 'UTC', year: "numeric", month:"numeric", day:"numeric" })
        if (props !== undefined && props.length != 0){
            var currentDataDOM = []

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
                var btn = document.createElement('button')
                btn.classList.add('retouraudirect')
                btn.innerText = 'back to live'
                document.querySelector('body').appendChild(btn)
                btn.addEventListener('click', (e)=>{
                    renderer(j(pathMaker, null, null), document.querySelector('#main'))
                    btn.style.display = "none";
                    document.querySelector('.oldbtn').style.display = "block";
                })
            return [ j('h2', {class: 'titre'}, "NASDAQ et CAC40"),
                    j('div', {class:'datadiv'}, currentDataDOM)]
        }
        return j('div', {class:'datadiv'}, 'data')
}
function chartData(props){
    var traceur = document.querySelector('#courbes')
//new Date(date.timestamp).toLocaleString('fr-FR', { timeZone: 'UTC', year: "numeric", month:"numeric", day:"numeric" })
    if (props !== undefined && props.length != 0){
        var currentDataDOM = props.map((dataNow, index)=>{
            return j('ul', {class:'case-'+(index+1)}, [
                j('li', {class:'hour'}, new Date(dataNow.timestamp).toLocaleString('fr-FR', { timeZone: 'UTC', hour: "numeric", minute:"numeric", second:"numeric" })),
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
                }, "data-index": index}, numberRounder.exec(dataNow.stocks.NASDAQ)[0]),
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
                }, "data-index": index}, numberRounder.exec(dataNow.stocks.CAC40)[0])
            ])
        })
        return j('div', {class:'datadiv'}, currentDataDOM)
    }
    return j('div', {class:'datadiv'}, 'data')
}
function fetcher(){
    fetch("http://localhost:8000/?count=20").then(res=>{
                return res.json()
            }).then(result=>{
                this.data = result
                return result
            })
}

class pathMaker extends React.Component{
    constructor(props){
        super(props)
        this.data = []
        this.coords = []
    }
    componentDidMount(){
            var intervalStarter = function(){
                var monInterval = window.setInterval(function(){
                    document.body.addEventListener('click', e=>{
                        clearInterval(monInterval)
                    })
                    fetcher()
                    renderer(j('div', {class: 'courbe'}, [fullChart(this.data), chartData(this.data)]), document.querySelector('#main'))
                }, 1000)
            }
            intervalStarter()
            window.onload = ()=>{
                if(localStorage.backup){
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
                }
            }
    }
    render(){
        fetch("http://localhost:8000/?count=20").then(res=>{
                return res.json()
            }).then(result=>{
                this.data = result
            })
        return j('div', {class: 'courbe'}, [fullChart(this.data), chartData(this.data)])
    }
}
renderer(j(pathMaker, null, null), document.querySelector('#main'))


