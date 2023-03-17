import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Portalphoto from 'App/Models/Portalphoto'

export default class CommentsController {
  public async store({ request, response, params }: HttpContextContract) {
    const body = request.body()
    const portalphotoId = params.portalphotoId

    await Portalphoto.findOrFail(portalphotoId)

    body.portalphotoId = portalphotoId

    const comment = await Comment.create(body)

    response.status(201)

    return {
      message: 'Comentário adicionado com sucesso!',
      data: comment,
    }
  }
}
