
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Configuración de estilo
plt.style.use('seaborn-v0_8-whitegrid')

# 1. Definición de Datos
data_futbol = [
    {"semana": i, "fase": "Acumulación", "volumen": 8, "intensidad": 4} for i in range(1,6)] + [
    {"semana": i, "fase": "Transformación", "volumen": 6, "intensidad": 8} for i in range(6,12)] + [
    {"semana": i, "fase": "Realización", "volumen": 4, "intensidad": 9} for i in range(12,15)] + [
    {"semana": i, "fase": "Transición", "volumen": 2, "intensidad": 3} for i in range(15,17)
]

data_tiro = [
    {"semana": i, "fase": "Prep_Gral", "volumen": 9, "intensidad": 4} for i in range(1,7)] + [
    {"semana": i, "fase": "Prep_Esp", "volumen": 7, "intensidad": 7} for i in range(7,11)] + [
    {"semana": i, "fase": "Comp_1", "volumen": 4, "intensidad": 9} for i in range(11,13)] + [
    {"semana": i, "fase": "Reajuste", "volumen": 6, "intensidad": 6} for i in range(13,16)] + [
    {"semana": i, "fase": "Comp_2", "volumen": 3, "intensidad": 10} for i in range(16,19)] + [
    {"semana": i, "fase": "Transición", "volumen": 2, "intensidad": 3} for i in range(19,21)
]

data_gimnasia = [
    {"semana": i, "fase": "Fuerza_Max", "volumen": 8, "intensidad": 9} for i in range(1,5)] + [
    {"semana": i, "fase": "Potencia", "volumen": 6, "intensidad": 9} for i in range(5,9)] + [
    {"semana": i, "fase": "Puesta_Punto", "volumen": 4, "intensidad": 9} for i in range(9,11)] + [
    {"semana": i, "fase": "Recuperación", "volumen": 2, "intensidad": 5} for i in range(11,13)
]

# Natacion: Simulación de curva Matveev
data_natacion = []
semanas_nat = 24
for i in range(1, semanas_nat + 1):
    fase = "Gral"
    if i > 8: fase = "Esp"
    if i > 14: fase = "PreComp"
    if i > 18: fase = "Comp"
    if i > 21: fase = "Trans"
    
    # Volumen baja de 9 a 2
    vol = 9 - (7 * (i-1) / (semanas_nat-1))
    if fase == "Trans": vol = 2
    
    # Intensidad sube de 3 a 10
    intes = 3 + (7 * (i-1) / (semanas_nat-1))
    if fase == "Trans": intes = 3
    
    data_natacion.append({"semana": i, "fase": fase, "volumen": vol, "intensidad": intes})

data_basket = [
    {"semana": i, "fase": "Bloque_Fuerza", "volumen": 8, "intensidad": 5} for i in range(1,7)] + [
    {"semana": i, "fase": "Bloque_Potencia", "volumen": 6, "intensidad": 8} for i in range(7,13)] + [
    {"semana": i, "fase": "Bloque_Comp", "volumen": 4, "intensidad": 10} for i in range(13,17)] + [
    {"semana": i, "fase": "Transición", "volumen": 2, "intensidad": 3} for i in range(17,19)
]

data_beisbol = []
for i in range(1, 21):
    fase = "Pretemporada"
    vol = 8
    intes = 6
    if i > 6:
        fase = "Temp_Regular"
        vol = 5
        intes = 8 + (i % 2) # Oscilacion
    if i > 16:
        fase = "Playoffs"
        vol = 3
        intes = 10
    if i == 20: 
        fase = "Descanso"
        vol = 1
        intes = 1
        
    data_beisbol.append({"semana": i, "fase": fase, "volumen": vol, "intensidad": intes})

data_boxeo = []
for i in range(1, 17):
    fase = "Pendular"
    # Efecto péndulo cada 4 semanas
    ciclo = (i-1) % 4
    if ciclo == 0 or ciclo == 1: # Carga General
        vol = 8
        intes = 5
    else: # Carga Especial
        vol = 5
        intes = 9
    
    if i > 14: # Tapering final
        vol = 3
        intes = 10
        
    data_boxeo.append({"semana": i, "fase": fase, "volumen": vol, "intensidad": intes})

# Lista de Datasets
datasets = [
    (pd.DataFrame(data_futbol), "FÚTBOL: Modelo ATR (16 sem)", "Razón: Temporada larga, picos recurrentes"),
    (pd.DataFrame(data_tiro), "TIRO CON ARCO: Prioridad Bompa (20 sem)", "Razón: Técnica fina, doble pico"),
    (pd.DataFrame(data_gimnasia), "GIMNASIA/PESAS: Modular (12 sem)", "Razón: Cargas extremas, fuerza máxima"),
    (pd.DataFrame(data_natacion), "NATACIÓN: Matveev Clásico (24 sem)", "Razón: Base aeróbica masiva inicial"),
    (pd.DataFrame(data_basket), "BALONCESTO: Bloques (18 sem)", "Razón: Concentración de cargas"),
    (pd.DataFrame(data_beisbol), "BÉISBOL: Multicíclico (20 sem)", "Razón: Temporada muy larga + Playoffs"),
    (pd.DataFrame(data_boxeo), "BOXEO: Pendular (16 sem)", "Razón: Alternancia rítmica general/especial")
]

# 2. Generación de Gráficos
fig, axes = plt.subplots(4, 2, figsize=(20, 22))
axes = axes.flatten()

# Colores IEU (Personalizados)
color_vol = '#1f77b4' # Azul
color_int = '#d62728' # Rojo IEU aproximado

for i, (df, titulo, razon) in enumerate(datasets):
    ax1 = axes[i]
    
    # Eje Volumen (Izquierdo)
    ax1.set_xlabel('Semana')
    ax1.set_ylabel('Volumen', color=color_vol, fontweight='bold')
    line1 = ax1.plot(df['semana'], df['volumen'], color=color_vol, label='Volumen', linewidth=2, marker='o', markersize=4)
    ax1.fill_between(df['semana'], df['volumen'], color=color_vol, alpha=0.2)
    ax1.tick_params(axis='y', labelcolor=color_vol)
    ax1.set_ylim(0, 11)
    
    # Eje Intensidad (Derecho)
    ax2 = ax1.twinx()
    ax2.set_ylabel('Intensidad', color=color_int, fontweight='bold')
    line2 = ax2.plot(df['semana'], df['intensidad'], color=color_int, label='Intensidad', linewidth=2, linestyle='-', marker='s', markersize=4)
    ax2.tick_params(axis='y', labelcolor=color_int)
    ax2.set_ylim(0, 11)
    
    # Títulos
    ax1.set_title(f"{titulo}\n{razon}", fontsize=12, fontweight='bold', pad=15)
    
    # Fases (Líneas verticales y texto)
    cambios_fase = df.loc[df['fase'] != df['fase'].shift()].index
    for idx in cambios_fase:
        sem = df.loc[idx, 'semana']
        fase_nombre = df.loc[idx, 'fase']
        ax1.axvline(x=sem, color='gray', linestyle='--', alpha=0.5)
        # Etiqueta de fase (alternando altura para no solapar)
        y_pos = 9.5 if (list(cambios_fase).index(idx) % 2 == 0) else 8.5
        ax1.text(sem + 0.5, y_pos, fase_nombre, rotation=0, fontsize=8, color='#333', backgroundcolor='white')

    # Cuadrícula
    ax1.grid(True, alpha=0.3)

# Eliminar el último gráfico vacío (el octavo)
fig.delaxes(axes[7])

# Título General
plt.suptitle('Comparativa de Modelos de Periodización por Deporte\nInstituto de Estudios Universitarios (IEU) - Metodología Deportiva', fontsize=20, fontweight='bold', y=0.99)

plt.tight_layout(rect=[0, 0.03, 1, 0.97])

# Guardar
output_path = 'assets/dashboard_periodizacion.png'
plt.savefig(output_path, dpi=300, bbox_inches='tight')
print(f"Gráfico generado exitosamente en: {output_path}")
