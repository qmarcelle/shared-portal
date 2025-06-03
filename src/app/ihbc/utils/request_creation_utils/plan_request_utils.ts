export function formatPlanId(planId: string|undefined){
  if(!planId){
    return undefined
  }

  if(planId.length < 4){
    return planId
  } else {
    return planId.substring(length - 4, length - 1)
  }

}