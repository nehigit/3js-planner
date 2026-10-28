/*
    Fades every mesh in `group` to `opacity` times its material's own opacity (1 restores the original look).
    Mutates the materials in place, so a material shared with meshes outside `group` fades there too.
*/
export default function setGroupOpacity(group, opacity) {
    group.traverse((object) => {
        if (!object.isMesh) return

        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => {
            // remember the material's own values the first time it's faded
            material.userData.original ??= { opacity: material.opacity, transparent: material.transparent }
            const { original } = material.userData

            const transparent = original.transparent || opacity < 1
            if (material.transparent !== transparent) {
                material.transparent = transparent
                material.needsUpdate = true
            }
            material.opacity = original.opacity * opacity
        })
    })
}
