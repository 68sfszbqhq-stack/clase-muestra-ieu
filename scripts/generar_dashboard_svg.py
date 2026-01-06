
import math

# Configuración del Canvas
width = 1200
height = 1400
margin = 50
cols = 2
rows = 4
grid_w = (width - (margin * 3)) / cols
grid_h = (height - (margin * 5)) / rows

def generar_datos_futbol():
    return [
        (i, 8, 4, "Acumulación") for i in range(1,6)] + [
        (i, 6, 8, "Transformación") for i in range(6,12)] + [
        (i, 4, 9, "Realización") for i in range(12,15)] + [
        (i, 2, 3, "Transición") for i in range(15,17)
    ]

def generar_datos_tiro():
    return [
        (i, 9, 4, "Prep_Gral") for i in range(1,7)] + [
        (i, 7, 7, "Prep_Esp") for i in range(7,11)] + [
        (i, 4, 9, "Comp_1") for i in range(11,13)] + [
        (i, 6, 6, "Reajuste") for i in range(13,16)] + [
        (i, 3, 10, "Comp_2") for i in range(16,19)] + [
        (i, 2, 3, "Transición") for i in range(19,21)
    ]

def generar_datos_gimnasia():
    return [
        (i, 8, 9, "Fuerza_Max") for i in range(1,5)] + [
        (i, 6, 9, "Potencia") for i in range(5,9)] + [
        (i, 4, 9, "Puesta_Punto") for i in range(9,11)] + [
        (i, 2, 5, "Recuperación") for i in range(11,13)
    ]

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
        if i > 21: vol = 2
        intes = 3 + (7 * (i-1) / (semanas_nat-1))
        if i > 21: intes = 3
        data.append((i, vol, intes, fase))
    return data

def generar_datos_basket():
    return [
        (i, 8, 5, "Bloque_Fuerza") for i in range(1,7)] + [
        (i, 6, 8, "Bloque_Potencia") for i in range(7,13)] + [
        (i, 4, 10, "Bloque_Comp") for i in range(13,17)] + [
        (i, 2, 3, "Transición") for i in range(17,19)
    ]

def generar_datos_beisbol():
    data = []
    for i in range(1, 21):
        fase = "Pretemp"
        vol = 8
        intes = 6
        if i > 6:
            fase = "Regular"
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
        data.append((i, vol, intes, fase))
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
        data.append((i, vol, intes, fase))
    return data

datasets = [
    (generar_datos_futbol(), "FÚTBOL: Modelo ATR (16 sem)", "Razón: Temporada larga, picos recurrentes"),
    (generar_datos_tiro(), "TIRO CON ARCO: Prioridad Bompa (20 sem)", "Razón: Técnica fina, doble pico"),
    (generar_datos_gimnasia(), "GIMNASIA/PESAS: Modular (12 sem)", "Razón: Cargas extremas, fuerza máxima"),
    (generar_datos_natacion(), "NATACIÓN: Matveev Clásico (24 sem)", "Razón: Base aeróbica masiva inicial"),
    (generar_datos_basket(), "BALONCESTO: Bloques (18 sem)", "Razón: Concentración de cargas"),
    (generar_datos_beisbol(), "BÉISBOL: Multicíclico (20 sem)", "Razón: Temporada muy larga + Playoffs"),
    (generar_datos_boxeo(), "BOXEO: Pendular (16 sem)", "Razón: Alternancia rítmica general/especial")
]

# Funciones SVG Helper
def svg_line(x1, y1, x2, y2, color, width=1, dash=""):
    dash_attr = f'stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{color}" stroke-width="{width}" {dash_attr} />'

def svg_circle(cx, cy, r, color):
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" fill="{color}" />'

def svg_text(x, y, text, size, color, anchor="middle", weight="normal", bg=None):
    t = f'<text x="{x:.1f}" y="{y:.1f}" font-family="Arial, sans-serif" font-size="{size}" fill="{color}" text-anchor="{anchor}" font-weight="{weight}">{text}</text>'
    if bg:
        # Estimación simple de ancho de texto
        w = len(text) * size * 0.6
        h = size * 1.2
        rect = f'<rect x="{x - w/2:.1f}" y="{y - h + size*0.2:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{bg}" />'
        return rect + t
    return t

def svg_poly(points, color, fill_opacity=0.2):
    pts_str = " ".join([f"{x:.1f},{y:.1f}" for x,y in points])
    return f'<polygon points="{pts_str}" fill="{color}" fill-opacity="{fill_opacity}" stroke="none" />'

# Colores IEU
COLOR_VOL = "#1f77b4" # Azul
COLOR_INT = "#d62728" # Rojo

svg_content = [f'<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg" style="background:white">']

# Título Global
svg_content.append(svg_text(width/2, 40, "Comparativa de Modelos de Periodización por Deporte", 28, "#333", weight="bold"))
svg_content.append(svg_text(width/2, 70, "Instituto de Estudios Universitarios (IEU) - Metodología Deportiva", 18, "#666"))

index = 0
for r in range(rows):
    for c in range(cols):
        if index >= len(datasets): break
        
        data, titulo, razon = datasets[index]
        
        # Coordenadas del gráfico actual
        x_base = margin + c * (grid_w + margin)
        y_base = margin * 2.5 + r * (grid_h + margin)
        w = grid_w
        h = grid_h
        
        # Marco del gráfico
        svg_content.append(f'<rect x="{x_base}" y="{y_base}" width="{w}" height="{h}" fill="none" stroke="#ddd" stroke-width="1"/>')
        
        # Título del gráfico
        svg_content.append(svg_text(x_base + w/2, y_base - 10, f"{titulo}", 14, "#000", weight="bold"))
        svg_content.append(svg_text(x_base + w/2, y_base + 15, razon, 12, "#555"))
        
        # Area de dibujo efectiva (con márgenes internos)
        pad = 40
        plot_x = x_base + pad
        plot_y = y_base + pad + 20
        plot_w = w - pad * 2
        plot_h = h - pad * 2
        
        # Escalas
        max_sem = max(d[0] for d in data)
        min_sem = min(d[0] for d in data)
        sem_range = max_sem - min_sem if max_sem > min_sem else 1
        
        def get_x(sem):
            return plot_x + ((sem - min_sem) / sem_range) * plot_w
            
        def get_y(val): # Asumiendo max 11 min 0
            return plot_y + plot_h - (val / 11.0) * plot_h

        # Ejes y Cuadrícula
        # Y labels
        for v in range(0, 12, 2):
            y = get_y(v)
            svg_content.append(svg_line(plot_x, y, plot_x + plot_w, y, "#eee"))
            svg_content.append(svg_text(plot_x - 10, y + 4, str(v), 10, "#888", anchor="end"))
            
        # X labels
        for s in range(min_sem, max_sem + 1):
            if s % 2 == 0 or s == min_sem or s == max_sem:
                 x = get_x(s)
                 svg_content.append(svg_text(x, plot_y + plot_h + 15, str(s), 10, "#888"))

        # Fases (Líneas verticales y etiquetas)
        temp_fase = data[0][3]
        temp_start = data[0][0]
        
        fases_list = []
        for d in data:
            if d[3] != temp_fase:
                fases_list.append((temp_fase, temp_start, d[0]-1))
                temp_fase = d[3]
                temp_start = d[0]
        fases_list.append((temp_fase, temp_start, data[-1][0]))
        
        for idx, (f_name, s_start, s_end) in enumerate(fases_list):
            x_s = get_x(s_start)
            if idx > 0: # Dibujar línea divisoria
                svg_content.append(svg_line(x_s, plot_y, x_s, plot_y + plot_h, "#666", width=1, dash="4,2"))
            
            x_e = get_x(s_end)
            x_mid = (x_s + x_e) / 2
            
            # Etiqueta Fase
            alt_y = plot_y + 15 if idx % 2 == 0 else plot_y + 30
            svg_content.append(svg_text(x_mid, alt_y, f_name, 10, "#333", bg="rgba(255,255,255,0.8)"))

        # Dibujar Datos
        # Volumen (Area)
        pts_vol = [(get_x(d[0]), get_y(d[1])) for d in data]
        poly_pts = [(get_x(data[0][0]), get_y(0))] + pts_vol + [(get_x(data[-1][0]), get_y(0))]
        svg_content.append(svg_poly(poly_pts, COLOR_VOL))
        
        # Volumen (Línea)
        for ii in range(len(pts_vol)-1):
            svg_content.append(svg_line(pts_vol[ii][0], pts_vol[ii][1], pts_vol[ii+1][0], pts_vol[ii+1][1], COLOR_VOL, width=2))
        for p in pts_vol:
            svg_content.append(svg_circle(p[0], p[1], 3, COLOR_VOL))
            
        # Intensidad (Línea)
        pts_int = [(get_x(d[0]), get_y(d[2])) for d in data]
        for ii in range(len(pts_int)-1):
            svg_content.append(svg_line(pts_int[ii][0], pts_int[ii][1], pts_int[ii+1][0], pts_int[ii+1][1], COLOR_INT, width=2))
        for p in pts_int:
            # Rectangulo marker para intensidad
            svg_content.append(f'<rect x="{p[0]-3:.1f}" y="{p[1]-3:.1f}" width="6" height="6" fill="{COLOR_INT}" />')

        # Leyenda pequeña por gráfico
        if index == 0: # Solo en el primero por limpieza
            svg_content.append(svg_text(plot_x + 30, plot_y + plot_h - 10, "Volumen", 12, COLOR_VOL, anchor="start"))
            svg_content.append(svg_text(plot_x + 90, plot_y + plot_h - 10, "Intensidad", 12, COLOR_INT, anchor="start"))

        index += 1

svg_content.append('</svg>')

with open('assets/dashboard_periodizacion.svg', 'w', encoding='utf-8') as f:
    f.write("\n".join(svg_content))

print("SVG Generado: assets/dashboard_periodizacion.svg")
