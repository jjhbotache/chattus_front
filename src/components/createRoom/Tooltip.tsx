import React, { useState } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, useClick, useDismiss, useRole, useInteractions, FloatingPortal } from '@floating-ui/react';


// Definimos un componente para el tooltip
const Tooltip = ({ children, label }: { children: React.ReactNode; label: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(0), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <span style={{
        display: 'grid',
        placeItems: 'center',
      }} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </span>
      <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={`tooltip ${isOpen ? 'open' : ''}`}
          >
            {label}
          </div>
      </FloatingPortal>
    </>
  );
};

export default Tooltip;