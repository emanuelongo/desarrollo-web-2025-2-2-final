import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { Room } from '../entities/room.entity';

export type CreateSessionDto = {
  roomId: string;
  userId: string;
  start: string; // ISO
  end: string;   // ISO
};

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session) private readonly sessionRepo: Repository<Session>,
    @InjectRepository(Room) private readonly roomRepo: Repository<Room>,
  ) {}

  async findAll(params?: { roomId?: string; start?: string; end?: string }) {
    const { roomId, start, end } = params ?? {};
    const qb = this.sessionRepo.createQueryBuilder('s');
    if (roomId) qb.andWhere('s.roomId = :roomId', { roomId });
    if (start) qb.andWhere('s.endAt >= :start', { start: new Date(start) });
    if (end) qb.andWhere('s.startAt <= :end', { end: new Date(end) });
    qb.orderBy('s.startAt', 'ASC');
    return qb.getMany();
  }

  async book(dto: CreateSessionDto(), params?: { roomId?: string; start?: string; end?: string; id?: number }) {
    // TODO (examen): detectar solapes por roomId y por userId mediante QueryBuilder y lanzar SESSION_OVERLAP

    const { roomId, start, end, id } = params ?? {};
    const qb = this.sessionRepo.createQueryBuilder('s');
    if (roomId) qb.andWhere('s.roomId = :roomId', { roomId });
    if (id) qb.andWhere('s.id = :userId', { id });
    if (start) qb.andWhere('s.endAt >= :start', { start: new Date(start).getMilliseconds });
    if (end) qb.andWhere('s.startAt <= :end', { end: new Date(end).getMilliseconds });
    qb.orderBy('s.startAt', 'ASC');
    
    if (!(start < existingEnd) && (end > existingStart)) {
      throw new BadRequestException({ message: 'Session overlap', code: 'SESSION_OVERLAP', details: [{ conflictWithSessionId: 'Hubo un conflicto con el id de la room' }] });
    };
    
    const room = await this.roomRepo.findOne({ where: { id: dto.roomId } });
    if (!room) {
      throw new BadRequestException({ message: 'Invalid room', code: 'INVALID_ROOM' });
    }
    const entity = this.sessionRepo.create({
      id: Math.round(Math.random() * 1e9).toString(36),
      roomId: dto.roomId,
      userId: dto.userId,
      startAt: new Date(dto.start),
      endAt: new Date(dto.end),
    });
    const saved = await this.sessionRepo.save(entity);
    return { id: saved.id };
  }
}


