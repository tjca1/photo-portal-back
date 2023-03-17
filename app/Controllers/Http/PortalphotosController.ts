import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Portalphoto from 'App/Models/Portalphoto'
import Application from '@ioc:Adonis/Core/Application'

import { v4 as uuidv4 } from 'uuid'

export default class PortalphotosController {
  private validationOptions = {
    types: ['image'],
    size: '2mb',
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const image = request.file('image', this.validationOptions)

    if (image) {
      const imageName = `${uuidv4()}.${image!.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const portalphoto = await Portalphoto.create(body)

    response.status(201)

    return {
      message: 'Portalphotoo criado com sucesso!',
      data: portalphoto,
    }
  }

  public async index() {
    const portalphotos = await Portalphoto.query().preload('comments')

    return {
      data: portalphotos,
    }
  }

  public async show({ params }: HttpContextContract) {
    const portalphoto = await Portalphoto.findOrFail(params.id)

    await portalphoto.load('comments')

    return {
      data: portalphoto,
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const portalphoto = await Portalphoto.findOrFail(params.id)

    await portalphoto.delete()

    return {
      message: 'Portalphotoo excluído com sucesso!',
      data: portalphoto,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()

    const portalphoto = await Portalphoto.findOrFail(params.id)

    portalphoto.title = body.title
    portalphoto.description = body.description

    if (portalphoto.image != body.image || !portalphoto.image) {
      const image = request.file('image', this.validationOptions)

      if (image) {
        const imageName = `${uuidv4()}.${image!.extname}`

        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })

        portalphoto.image = imageName
      }
    }

    await portalphoto.save()

    return {
      message: 'Portalphotoo atualizado com sucesso!',
      data: portalphoto,
    }
  }
}
