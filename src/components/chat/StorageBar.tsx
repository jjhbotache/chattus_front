import styled from 'styled-components';

const BarraContainer = styled.div`
  .barra-contenedor {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background-color: #e2e8f0;
  }

  .barra-progreso {
    height: 100%;
    transition: all 300ms ease-out;
  }

  .verde { background-color: #10b981; }
  .amarillo { background-color: #f59e0b; }
  .naranja { background-color: #f97316; }
  .rojo { background-color: #ef4444; }
`;

export default function StorageBar({ porcentaje = 0 }) {
  // Asegurar que el porcentaje esté entre 0 y 100
  const porcentajeSeguro = Math.min(100, Math.max(0, porcentaje));

  // Calcular el color basado en el porcentaje
  const obtenerColorClase = (pct: number) => {
    if (pct < 30) return 'verde';
    if (pct < 60) return 'amarillo';
    if (pct < 90) return 'naranja';
    return 'rojo';
  };

  
  return (
    <BarraContainer>
      <div className="barra-contenedor">
        <div
          className={`barra-progreso ${obtenerColorClase(porcentajeSeguro)}`}
          style={{ width: `${porcentajeSeguro}%` }}
        />
      </div>
    </BarraContainer>
  );
}