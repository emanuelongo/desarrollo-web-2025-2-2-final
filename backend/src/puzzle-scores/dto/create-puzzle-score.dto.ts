import { IsBoolean, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreatePuzzleScoreDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsInt()
  @Min(1)
  attempt!: number;

  // TODO: Validar rango 0–100
  @Min(0)
  @Max(100)
  score!: number;

  @IsBoolean()
  @(this.score > 70)
  isFinal!: boolean;

  // TODO: Si isFinal === true, exigir score >= 70 (validación a nivel de clase)
  // TODO: Si attempt > 1, exigir score >= previousScore (usar servicio expuesto)
}


