
import matplotlib.pyplot as plt
import sys

# Verificar si matplotlib está disponible
try:
    import matplotlib.pyplot as plt
except ImportError:
    print("Error: Matplotlib no está instalado. No se puede generar el gráfico.")
    sys.exit(1)

# Configuración de estilo manual (para no depender de estilos específicos que podrían no estar)
# plt.style.use('seaborn-whitegrid') # Comentado por si acaso no existe el estilo

# 1. Definición de Datos (Usando Listas de Diccionarios y lógica pura)

def generar_datos_futbol():
    data = []
    # Acumulación (1-5)
    for i in range(1, 6): data.append({"semana": i, "fase": "Acumulación", "volumen": 8, "intensidad": 4})
    # Transformación (6-11)
    for i in range(6, 12): data.append({"semana": i, "fase": "Transformación", "volumen": 6, "intensidad": 8})
    # Realización (12-14)
    for i in range(12, 15): data.append({"semana": i, "fase": "Realización", "volumen": 4, "intensidad": 9})
    # Transición (15-16)
    for i in range(15, 17): data.append({"semana": i, "fase": "Transición", "volumen": 2, "intensidad": 3})
    return data

def generar_datos_tiro():
    data = []
    for i in range(1, 7): data.append({"semana": i, "fase": "Prep_Gral", "volumen": 9, "intensidad": 4})
    for i in range(7, 11): data.append({"semana": i, "fase": "Prep_Esp", "volumen": 7, "intensidad": 7})
    for i in range(11, 13): data.append({"semana": i, "fase": "Comp_1", "volumen": 4, "intensidad": 9})
    for i in range(13, 16): data.append({"semana": i, "fase": "Reajuste", "volumen": 6, "intensidad": 6})
    for i in range(16, 19): data.append({"semana": i, "fase": "Comp_2", "volumen": 3, "intensidad": 10})
    for i in range(19, 21): data.append({"semana": i, "fase": "Transición", "volumen": 2, "intensidad": 3})
    return data

def generar_datos_gimnasia():
    data = []
    for i in range(1, 5): data.append({"semana": i, "fase": "Fuerza_Max", "volumen": 8, "intensidad": 9})
    for i in range(5, 9): data.append({"semana": i, "fase": "Potencia", "volumen": 6, "intensidad": 9})
    for i in range(9, 11): data.append({"semana": i, "fase": "Puesta_Punto", "volumen": 4, "intensidad": 9})
    for i in range(11, 13): data.append({"semana": i, "fase": "Recuperación", "volumen": 2, "intensidad": 5})
    return data

def generar_datos_natacion():
    data = []
    semanas_nat = 24
    for i in range(1, semanas_nat + 1):
        fase = "Gral"
        if i > 8: fase = "Esp"
        if i > 14: fase = "PreComp"
        if i > 18: fase = "Comp"
        if i > 21: fase = "Trans"
        
        vol = 9 - (7 * (i-1) / (semanas_nat-1))
        if i > 21: vol = 2 # Transición
        
        intes = 3 + (7 * (i-1) / (semanas_nat-1))
        if i > 21: intes = 3 # Transición
        
        data.append({"semana": i, "fase": fase, "volumen": vol, "intensidad": intes})
    return data

def generar_datos_basket():
    data = []
    for i in range(1, 7): data.append({"semana": i, "fase": "Bloque_Fuerza", "volumen": 8, "intensidad": 5})
    for i in range(7, 13): data.append({"semana": i, "fase": "Bloque_Potencia", "volumen": 6, "intensidad": 8})
    for i in range(13, 17): data.append({"semana": i, "fase": "Bloque_Comp", "volumen": 4, "intensidad": 10})
    for i in range(17, 19): data.append({"semana": i, "fase": "Transición", "volumen": 2, "intensidad": 3})
    return data

def generar_datos_beisbol():
    data = []
    for i in range(1, 21):
        fase = "Pretemporada"
        vol = 8
        intes = 6
        if i > 6:
            fase = "Temp_Regular"
            vol = 5
            intes = 8 + (i % 2) 
        if i > 16:
            fase = "Playoffs"
            vol = 3
            intes = 10
        if i == 20: 
            fase = "Descanso"
            vol = 1
            intes = 1
        data.append({"semana": i, "fase": fase, "volumen": vol, "intensidad": intes})
    return data

def generar_datos_boxeo():
    data = []
    for i in range(1, 17):
        fase = "Pendular"
        ciclo = (i-1) % 4
        if ciclo == 0 or ciclo == 1:
            vol = 8
            intes = 5
        else:
            vol = 5
            intes = 9
        
        if i > 14:
            vol = 3
            intes = 10
        data.append({"semana": i, "fase": fase, "volumen": vol, "intensidad": intes})
    return data

# Lista de Datasets (Tuplas: data, titulo, razon)
datasets = [
    (generar_datos_futbol(), "FÚTBOL: Modelo ATR (16 sem)", "Razón: Temporada larga, picos recurrentes"),
    (generar_datos_tiro(), "TIRO CON ARCO: Prioridad Bompa (20 sem)", "Razón: Técnica fina, doble pico"),
    (generar_datos_gimnasia(), "GIMNASIA/PESAS: Modular (12 sem)", "Razón: Cargas extremas, fuerza máxima"),
    (generar_datos_natacion(), "NATACIÓN: Matveev Clásico (24 sem)", "Razón: Base aeróbica masiva inicial"),
    (generar_datos_basket(), "BALONCESTO: Bloques (18 sem)", "Razón: Concentración de cargas"),
    (generar_datos_beisbol(), "BÉISBOL: Multicíclico (20 sem)", "Razón: Temporada muy larga + Playoffs"),
    (generar_datos_boxeo(), "BOXEO: Pendular (16 sem)", "Razón: Alternancia rítmica general/especial")
]

# 2. Generación de Gráficos
fig, axes = plt.subplots(4, 2, figsize=(20, 22))
axes = axes.flatten() # Aplanar para iterar fácilmente

# Colores
color_vol = '#1f77b4' 
color_int = '#d62728' 

for i, (data, titulo, razon) in enumerate(datasets):
    if i >= len(axes): break
    
    ax1 = axes[i]
    
    # Preparar listas para plot
    semanas = [d['semana'] for d in data]
    volumenes = [d['volumen'] for d in data]
    intensidades = [d['intensidad'] for d in data]
    
    # Eje Volumen (Izquierdo)
    ax1.set_xlabel('Semana')
    ax1.set_ylabel('Volumen', color=color_vol, fontweight='bold')
    ax1.plot(semanas, volumenes, color=color_vol, label='Volumen', linewidth=2, marker='o', markersize=4)
    ax1.fill_between(semanas, volumenes, color=color_vol, alpha=0.2)
    ax1.tick_params(axis='y', labelcolor=color_vol)
    ax1.set_ylim(0, 11)
    
    # Eje Intensidad (Derecho)
    ax2 = ax1.twinx()
    ax2.set_ylabel('Intensidad', color=color_int, fontweight='bold')
    ax2.plot(semanas, intensidades, color=color_int, label='Intensidad', linewidth=2, linestyle='-', marker='s', markersize=4)
    ax2.tick_params(axis='y', labelcolor=color_int)
    ax2.set_ylim(0, 11)
    
    # Títulos
    ax1.set_title(f"{titulo}\n{razon}", fontsize=12, fontweight='bold', pad=15)
    
    # Fases (Líneas verticales)
    # Detectar cambios
    fases_detectadas = []
    for idx, item in enumerate(data):
        if idx == 0: continue
        if item['fase'] != data[idx-1]['fase']:
            fases_detectadas.append((item['semana'], item['fase']))
            
    # Marcar fases
    # Agregar la primera fase manualmente al inicio si se desea, o solo los cambios
    # Aquí marcamos donde CAMBIA
    for sem, nombre_fase in fases_detectadas:
        ax1.axvline(x=sem, color='gray', linestyle='--', alpha=0.5)
        
    # Etiquetas de fases (más complejo sin pandas, simplificado aquí)
    # Vamos a poner el texto en el punto medio de cada fase
    current_fase = data[0]['fase']
    start_sem = data[0]['semana']
    
    # Procesar para poner etiquetas
    # Re-recorrer para agrupar fases
    fases_ranges = []
    temp_start = data[0]['semana']
    temp_fase = data[0]['fase']
    
    for item in data:
        if item['fase'] != temp_fase:
            fases_ranges.append({'fase': temp_fase, 'start': temp_start, 'end': item['semana']-1})
            temp_fase = item['fase']
            temp_start = item['semana']
    fases_ranges.append({'fase': temp_fase, 'start': temp_start, 'end': data[-1]['semana']})
    
    for idx, f in enumerate(fases_ranges):
        mid_point = (f['start'] + f['end']) / 2
        y_pos = 9.5 if (idx % 2 == 0) else 8.5
        ax1.text(mid_point, y_pos, f['fase'], ha='center', fontsize=8, color='#333', backgroundcolor='white')

    ax1.grid(True, alpha=0.3)

# Eliminar el último gráfico si sobra
if len(datasets) < len(axes):
    for j in range(len(datasets), len(axes)):
        fig.delaxes(axes[j])

plt.suptitle('Comparativa de Modelos de Periodización por Deporte\nInstituto de Estudios Universitarios (IEU) - Metodología Deportiva', fontsize=20, fontweight='bold', y=0.99)
plt.tight_layout(rect=[0, 0.03, 1, 0.97])

output_path = 'assets/dashboard_periodizacion.png'
plt.savefig(output_path, dpi=300, bbox_inches='tight')
print(f"Gráfico generado: {output_path}")
