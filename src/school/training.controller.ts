import { Controller, Post } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Subject } from './subject.entity'
import { Teacher } from './teacher.entity'

@Controller('school')
export class TrainingController {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>
  ) {}

  @Post('/create')
  public async savingRelation() {
    // get subject, teachers
    const [subject, teacher1, teacher2] = await Promise.all([
      this.subjectRepository.findOne({ where: { id: 5 } }),
      this.teacherRepository.findOne({ where: { id: 1 } }),
      this.teacherRepository.findOne({ where: { id: 2 } })
    ])

    // one subject can have alot of teachers
    // one teacher can teach many subject
    // we createQueryBuilder to assign ONE `subject` to TWO `teachers`
    // This is my mind, may be wrong
    return await this.subjectRepository
      .createQueryBuilder()
      .relation(Subject, 'teachers') //name Entity and tables relations
      .of(subject) // refrence to data Entity
      .add([teacher1, teacher2]) // add data
  }

  @Post('/remove')
  public async removingRelation() {
    return await this.subjectRepository
      .createQueryBuilder('s')
      .update()
      .set({ name: 'Confidential' })
      .execute()
  }
}
