import { useState, useEffect } from 'react'
import FileUpload from '../components/ui/FileUpload'
import CircularProgressBar, { LoadingProgressBar, LinearProgressBar } from '../components/ui/ProgressBar'
import ConnectionStatus from '../components/common/ConnectionStatus'
import { useImageAnalysis } from '../hooks/useImageAnalysis'

const Analizar = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const { 
    analyzeImage, 
    isAnalyzing, 
    result, 
    error, 
    progress, 
    connectionStatus,
    reset,
    checkConnectivity 
  } = useImageAnalysis()

  // Verificar conectividad al cargar la página
  useEffect(() => {
    checkConnectivity()
  }, [])

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    // Reset previous results when new file is selected
    if (result || error) {
      reset()
    }
  }

  const handleAnalyze = async () => {
    if (selectedFile) {
      await analyzeImage(selectedFile)
    }
  }

  const handleNewAnalysis = () => {
    setSelectedFile(null)
    reset()
  }

  const getRecommendation = (probability) => {
    if (probability <= 30) {
      return {
        title: 'Riesgo Bajo',
        message: 'Los resultados sugieren un riesgo bajo. Sin embargo, es recomendable realizar chequeos regulares con un dermatólogo.',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
    } else if (probability <= 60) {
      return {
        title: 'Riesgo Moderado', 
        message: 'Los resultados sugieren un riesgo moderado. Se recomienda consultar con un dermatólogo para una evaluación profesional.',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      }
    } else {
      return {
        title: 'Riesgo Alto',
        message: 'Los resultados sugieren un riesgo alto. Es importante consultar con un dermatólogo lo antes posible para una evaluación detallada.',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    }
  }

  return (
    <div className="py-8 space-y-6">
      {/* Header mejorado */}
      <div className="card bg-gradient-to-r from-secondary/5 to-accent/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-secondary to-accent p-3 rounded-full mr-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Análisis Inteligente de Piel</h1>
              <p className="text-sm text-gray-600">Tecnología de IA médica avanzada • Precisión del 95%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Online
            </div>
            <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              IA Médica
            </div>
          </div>
        </div>
        
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="text-lg font-bold text-secondary">95%</div>
            <div className="text-xs text-gray-600">Precisión</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="text-lg font-bold text-accent">&lt;30s</div>
            <div className="text-xs text-gray-600">Análisis</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="text-lg font-bold text-green-600">24/7</div>
            <div className="text-xs text-gray-600">Disponible</div>
          </div>
        </div>
        
        <ConnectionStatus />
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto">
        {!result ? (
          // Vista de subida y análisis mejorada
          <div className="space-y-6">
            {/* Proceso paso a paso */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Proceso de Análisis</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedFile ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                    1
                  </div>
                  <div className={`w-16 h-1 ${selectedFile ? 'bg-green-500' : 'bg-gray-200'} rounded`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isAnalyzing || result ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    2
                  </div>
                  <div className={`w-16 h-1 ${result ? 'bg-green-500' : 'bg-gray-200'} rounded`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${result ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    3
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* Paso 1: Subir imagen */}
                <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${selectedFile ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'}`}>
                  <div className="flex items-center mb-3">
                   
                      <svg classNam>
                        <pav12" />
                      /svg>
                </div>
                  div>
>
                      <p className="text-x
                    </div>
                  </div>
                  {selectedFile && (
                    <div className="flex items-center text-xs text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                         />
                      >
                     
                    </div>
                  )}
                </div>

              
                <div className={`p-4 rounded-lg b}>
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-full mr-3 ${isAnalyzing ? 'bg-secondary' : 'bg-gray-400'}`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      /h3>
                

                  </div>
                  {isAnalyzing && (
                    <div className="flex items-center text-xs text-secondary">
                      <div className="w-3 h-3 mr-1 border-2 border-secondary border-t-transparent rounded-full ani
                      Analizando...
                    </div>
                  )}
                </div>

                {/* Paso 3: Resultados */}
                <div cy-50'}`}>
                  <div mb-3">
                
">
                        <path s
                      </svg>
                    </div>
                    <div>
                      <h3 className="fon3>
                      <p>
                    </div>
                  </div>
                  {result && (
                    <div className=">
                    
                        <path fillRule="evenodd" d="M16 />
                      </svg>
                      o
                    </div>
                  )}
v>
              </div>
            </div>

            {/* Panel principal de análisis */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Subida d
              <div class2">
                <div className="card h-full">
                  <div className="flex items-center justify-betwee">
                    <div >
                      <div className="bg-grr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24">
                   
                        </svg>
                      </div
                      <div>
                
                  
                >
             >
                    {selectedFil && (
                      <div className=>
                        ✓ Cargada
                      </div>
                    )}
                  </div>
                  
                  <FileUpload 
                    onFileSelect={handleFileSelect}
                    disabl}
                  />
                  
                  {selectedFile && !isAnalyzing && (
                    <div className="mt-4 space-y-3">
                      <d3">
                      ">
                          <svg className 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9 />
                          </svg>
                          Imagen lista para análisis
                        </v>
                      </
                      <b
                  
                    
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-54">
                            <path strokeLinec/>
                          </svg>
                          Iniciar Análisis con IA
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </

              {/* Panel de estado */}
              <div className="card h-full">
                <div className="flex item-4">
                  <div 3">
                    <svg className="w-5 h-5 text-white" fi
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9." />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">Estado del Sistema</h3>
                    <p className="text-xs text-gray-600">Monitoreo en tiempo l</p>
                  </div>
                </div>

                {!selectedFile && !isAnalyzing && (
                  <div className="text-center py-8">
                    <div c
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" view
                        <path strokeLinecap="round" strokeLinejoin="round />
                      </svg>
                    </div>
                    <p cla..</p>
                    <div c>
                      <d">
                      ivo
                    /div>
                  
able
                      </div>
                    </div>
                  </div>
                )}

                {select
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p clas>
                    <p className="text-xs text-gray-600 mb-4">Listo para procesar im/p>
                    <div className="space-y-2">
                      <div cl00">
                        ✓ Imagen validada
                      </div>
                      <div>
                    
                      </div>
                    </div>
                  </div>
                )}

zing && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full flex i
                      <svg className="w-8 h-8 text-white animate- 24 24">
                        <p5" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-primary mb-2">ProcesIA</h3>
                    <LinearProgressBar 
                      percentage={progress} 
                      color="secondary" 
                      className="mb-4"
                    />
                    <div classNa>
                      <div 
                        🧠 Anes
                      </div>
                      <dcent">
                 des
                   iv>
                  >
">
                      Tiempo/ 20))}s
                    </p>
                  </div>
                )}

                {error && (
                 >
                    <div className="w-16 ">
                      <sv>
                     >
                    g>
                    </div>
                    <p className="t>
                    <p className="text-xs tex
                    <button
                   
                      className="bg0"
                    >
                      r
                    </
                  </div>
                )}
              </div>
          iv>
          </v>di  </dutton>bntainteReation-20s duron-colortransitium font-medilg text-xs -2 rounded-hite px-4 pyext-wed-600 tr:bg-rd-500 hove-re)}t({() => rese   onClick=>{error}</p>-4"ay-600 mbgrt- Análisis</p>Error en el"text-smb-2 nt-medium m-600 foredext- </sv  0118 0z" /18 0 9 9 0 0 11-1M21 12a9 9m0 4h.0"M12 8v4 d=eWidth={2}okround" strejoin="okeLin" strd"rounrokeLinecap= stath   <p"0 0 24 24"ewBox=Color" virrent"custroke=none" ll=" fit-red-500"8 h-8 texme="w-g classNamb-4 mx-auto tercenfy-enter justitems-clex iunded-full fed-100 ro6 bg-rh-1r py-6"centeme="text-ssNala c <divogress) 100 - prh.ceil((x(1, Matth.maMao: { estimad-600 mt-3t-grayt-xs texsName="tex  <p clas                  iv/d <   </d babilidado proan    📊 Calcul   -acext-xs textd-lg p-2 tounde0 rnt/1bg-accessName="iv cla patrolizandonandary">co text-se p-2 text-xsded-lg/10 roung-secondaryName="bclass"-y-2me="spacecon ando  2H157.3m157-20 01-15.35.003 0 0a8.003 881m11v-5h-.51  0H9m1 9m0.582001 0 0041 8. 2A8.00.35615M4 4v5h.582m="={2} ddthkeWid" stro="rounininejod" strokeL="rounecapeLintrokath s 0"0" viewBox=urrentColorroke="c st""noneill= fspin"">-pulsemateb-4 anito menter mx-au justify-ctems-centerlyisAna  {              rada  ✓ IA prepa  blue-700"xt-xs text-telg p-2 unded-blue-100 ro"bg-sName= clasen-7text-gre text-xs unded-lg p-200 roeen-1Name="bg-grassagen<do</pPreparaistema mb-2">St-medium ry fonrimatext-pm ame="text-ssN& (yzing & !isAnaledFile &&exión: Eston     ✓ C                   -600">text-gray-xs lg p-2 textounded--100 raybg-grssName="    <div cla  < IA: Act Sistema  ✓t-gray-600ext-xs texd-lg p-2 tnderou-gray-100 e="bgassNamiv clspace-y-2"sName="lasando imagen.">Esperay-500 mb-4xt-grt-sm tessName="tex2 2z"2a2 2 0 000 00-2 2v1-2-2H6a2 2 6a2 2 0 000 002-2V12a2 2 1M6 20h6-6h.00L20 14m-.828  0121.586a2 2 0.586-m-2-2l16 168 0L1012.826a2 2 0 6-4.58"M4 16l4.58Width={2} d=troke" s24">0 24 Box="0 ">o mb-4r mx-autcenter justify-s-cente itemed-full flexound r-200o-grayay-100 tr from-gro-nt-t16 bg-gradiew-16 h-="amelassNear-.548-.547z88-2.386l.754-.96-11c0-.895-.3553 0v-.-419a2 2 0 1169V8.474 0 0014 17A3.374 3.3-.548.54 0l 5 0 117.072m2.828 9.9a5707-.-5.657l-.707m3.343 12H37M21 12h-1M4.70-.636l-.70764v1m6.34.673M12 3663 17h24">="0 0 24 Boxolor" viewe="currentC" strokl="nonelull mr-d-fdeun roent p-2ndary to-acc from-seco-to-rg-gradientsName="bclascenter mbs-div>9-11h-7z" 7v7l0V3L4 14hd="M13 1dth={2} strokeWind" n="rouinejoiokeLnd" strrou="ap24 20 0 " viewBox="orolrrentCstroke="cull="none" " fi mr-2 h-5hadow-lg"le-105 sover:sca hormtransfation-300 l duransition-alounded-lg tr rpx-6py-4 d  font-bolxt-whiteent/90 te-acc:tory/90 hoverecondahover:from-sy to-accent econdarto-r from-sient-full bg-gradw-assName="  cl  alyze}ck={handleAnnCli      oonuttiv>ddinodd"pRule="evecli-1-1H9z" a1 1 0 00-3 1 0 100-2va11 1h10 003a1 1  1 0 000 2va1 20Box="0 0 viewntColor"l="curre mr-2" fil-4="w-4 hblue-700xt--sm tetexter items-centx me="fleNaass  <div clp-nded-lg 0 roue-20border-blu-50 border lue-bbglassName="iv clyzinged={isAnat-medium"s fon-xnded text1 rou2 py-reen-700 px--gext0 t10-green-"bgeiv       </ddiv      </
        ) : (
          // Vista de resultados
          <div className="space-y-4">
            {/* Resultado principal */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-green-500/10 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Resultado del Análisis</h2>
                    <p className="text-sm text-gray-600">Evaluación completada con IA</p>
                  </div>
                </div>
                {result.isSimulated && (
                  <div className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Demo
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Progress bar circular */}
                <div className="text-center">
                  <CircularProgressBar 
                    percentage={result.result.probability}
                    size={180}
                    color="dynamic"
                    animated={true}
                  />
                </div>
                
                {/* Información del resultado */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary mb-3">
                    Detalles del Análisis
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Probabilidad</p>
                      <p className="font-bold text-primary">{result.result.probability}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Confianza</p>
                      <p className="font-bold text-primary">{(result.result.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Tiempo</p>
                      <p className="font-bold text-primary">{result.result.processing_time.toFixed(1)}s</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Fecha</p>
                      <p className="font-bold text-primary text-xs">
                        {new Date(result.result.timestamp).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recomendación */}
            <div className="card">
              {(() => {
                const recommendation = getRecommendation(result.result.probability)
                return (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className={`${recommendation.color === 'text-green-600' ? 'bg-green-500/10' : recommendation.color === 'text-yellow-600' ? 'bg-yellow-500/10' : 'bg-red-500/10'} p-2 rounded-full mr-3`}>
                        <svg className={`w-5 h-5 ${recommendation.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${recommendation.color}`}>
                          Recomendación: {recommendation.title}
                        </h3>
                        <p className="text-xs text-gray-600">Basado en el análisis de IA</p>
                      </div>
                    </div>
                    
                    <div className={`${recommendation.bgColor} ${recommendation.borderColor} border rounded-lg p-4 mb-4`}>
                      <p className="text-sm text-primary mb-3">
                        {recommendation.message}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                      <h4 className="font-bold text-primary mb-3 text-sm">Próximos pasos recomendados:</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          { icon: '👨‍⚕️', text: 'Consulta con dermatólogo' },
                          { icon: '📋', text: 'Lleva este resultado a tu cita' },
                          { icon: '📸', text: 'Mantén registro fotográfico' },
                          { icon: '🔍', text: 'Realiza autoexámenes regulares' }
                        ].map((step, index) => (
                          <div key={index} className="flex items-center bg-white p-2 rounded-lg">
                            <span className="text-lg mr-2">{step.icon}</span>
                            <span className="text-xs text-primary font-medium">{step.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Acciones */}
            <div className="card text-center">
              <div className="space-y-4">
                <button
                  onClick={handleNewAnalysis}
                  className="btn-primary px-6 py-3 w-full md:w-auto"
                >
                  Realizar Nuevo Análisis
                </button>
                <div>
                  <a
                    href="https://wa.me/67708839"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200 text-sm"
                  >
                    <span>📱</span>
                    <span>Contactar soporte por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analizar