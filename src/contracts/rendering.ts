/** Vendor-neutral contracts: Pixi/Babylon adapters are separate, optional packages. */
export interface RenderContext { readonly width: number; readonly height: number; readonly pixelRatio: number; }
export interface RendererAdapter {
  readonly kind: '2d' | '3d';
  initialize(context: RenderContext): Promise<void> | void;
  draw(interpolation: number): void;
  resize(context: RenderContext): void;
  dispose(): void;
}
export interface PhysicsWorld {
  readonly dimension: '2d' | '3d';
  step(fixedDeltaSeconds: number): void;
  dispose(): void;
}
